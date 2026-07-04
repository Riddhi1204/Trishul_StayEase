"""
auth/service.py
───────────────
Business logic for user registration and authentication.

All database calls go through database/crud.py — no raw MongoDB here.
"""

from datetime import datetime, timezone

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from auth.schemas import UserCreate, UserLogin
from database.crud import (
    create_user,
    get_user_by_email,
    get_user_by_phone,
)
from security.jwt import create_access_token
from security.password import hash_password, verify_password


async def register_user(db: AsyncIOMotorDatabase, data: UserCreate) -> dict:
    """
    Register a new user account.

    Checks:
      1. Email uniqueness
      2. Phone uniqueness
      3. Hashes password (never stored plain)
      4. Inserts user document
      5. Returns JWT token + user profile

    Raises:
        409 Conflict — if email or phone already registered.
    """
    # Email uniqueness check
    if await get_user_by_email(db, data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Phone uniqueness check
    if await get_user_by_phone(db, data.phone):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this phone number already exists.",
        )

    now = datetime.now(timezone.utc)
    user_doc = {
        "fullName":     data.fullName.strip(),
        "email":        data.email.lower().strip(),
        "phone":        data.phone,
        "passwordHash": hash_password(data.password),
        "role":         data.role,
        "profileImage": None,
        "createdAt":    now,
        "updatedAt":    now,
    }

    user = await create_user(db, user_doc)   # returns user WITHOUT passwordHash

    token = create_access_token({
        "sub":   user["id"],
        "email": user["email"],
        "role":  user["role"],
    })

    return {"token": token, "user": user}


async def login_user(db: AsyncIOMotorDatabase, data: UserLogin) -> dict:
    """
    Authenticate a user with email + password.

    Returns JWT token + user profile on success.

    Raises:
        401 Unauthorized — for any credential mismatch.
        (Generic message prevents email enumeration attacks.)
    """
    _INVALID = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Fetch full doc including passwordHash for verification
    user = await get_user_by_email(db, data.email, include_password=True)
    if not user:
        raise _INVALID

    if not verify_password(data.password, user.get("passwordHash", "")):
        raise _INVALID

    # Strip passwordHash before building the response
    user.pop("passwordHash", None)

    token = create_access_token({
        "sub":   user["id"],
        "email": user["email"],
        "role":  user["role"],
    })

    return {"token": token, "user": user}
