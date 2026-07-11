"""
auth/router.py
──────────────
Authentication API endpoints.

Routes:
    POST /auth/register  — create account, returns JWT + user
    POST /auth/login     — authenticate, returns JWT + user
    GET  /auth/me        — get current user profile from JWT
"""

from fastapi import APIRouter, Depends, status, Request
from motor.motor_asyncio import AsyncIOMotorDatabase

from auth.dependencies import get_current_user
from auth.schemas import MessageResponse, TokenResponse, UserCreate, UserLogin, UserResponse, GoogleAuthRequest
from auth.service import login_user, register_user
from auth.google import verify_google_token_and_login
from database.deps import get_db
from security.rate_limit import limiter

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
@limiter.limit("5/15minutes")
async def register(
    request: Request,
    data: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> TokenResponse:
    """
    Create a new user account.

    - Validates all fields (email format, phone format, password match)
    - Checks email and phone uniqueness
    - Hashes password with bcrypt
    - Returns a JWT access token + user profile
    """
    result = await register_user(db, data)
    return TokenResponse(
        access_token=result["token"],
        user=UserResponse(**result["user"]),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login with email and password",
)
@limiter.limit("5/15minutes")
async def login(
    request: Request,
    data: UserLogin,
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> TokenResponse:
    """
    Authenticate with email + password.

    Returns a JWT access token + user profile on success.
    Returns 401 for any credential mismatch (generic message prevents enumeration).
    """
    result = await login_user(db, data)
    return TokenResponse(
        access_token=result["token"],
        user=UserResponse(**result["user"]),
    )


@router.post(
    "/google",
    response_model=TokenResponse,
    summary="Login or Register with Google",
)
@limiter.limit("5/15minutes")
async def google_login(
    request: Request,
    data: GoogleAuthRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> TokenResponse:
    """
    Authenticate with a Google ID token.
    If the user does not exist, an account is created automatically.
    Returns a JWT access token + user profile on success.
    """
    result = await verify_google_token_and_login(db, data.idToken, data.role)
    return TokenResponse(
        access_token=result["token"],
        user=UserResponse(**result["user"]),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user profile",
)
async def get_me(
    current_user: dict = Depends(get_current_user),
) -> UserResponse:
    """
    Returns the profile of the currently authenticated user.

    Requires: Authorization: Bearer <token>
    """
    return UserResponse(**current_user)
