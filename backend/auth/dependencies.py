"""
auth/dependencies.py
────────────────────
FastAPI dependency functions for authentication and role-based authorisation.

Usage in routes:
    # Any authenticated user
    @router.get("/profile")
    async def profile(user = Depends(get_current_user)):
        ...

    # Host or Admin only
    @router.post("/properties")
    async def create(user = Depends(require_host)):
        ...

    # Admin only
    @router.get("/admin/users")
    async def all_users(user = Depends(require_admin)):
        ...
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from motor.motor_asyncio import AsyncIOMotorDatabase

from database.crud import get_user_by_id
from database.deps import get_db
from security.jwt import verify_token

# HTTPBearer extracts the token from the Authorization: Bearer <token> header
_bearer = HTTPBearer(auto_error=True)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    """
    Core auth dependency — validates JWT and returns the current user dict.

    Raises:
        401 — if token is missing, invalid, or expired.
        401 — if the user account no longer exists in the database.
    """
    _unauth = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Please log in.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = verify_token(credentials.credentials)
    except JWTError:
        raise _unauth

    user_id = payload.get("sub")
    if not user_id:
        raise _unauth

    user = await get_user_by_id(db, user_id)
    if not user:
        raise _unauth

    return user


# ── Role checker — callable class pattern ─────────────────────────
# FastAPI supports callable classes as dependencies; using a class instead
# of a closure gives better repr() output in /docs.

class RoleChecker:
    """
    Reusable role-based authorisation dependency.

    Example:
        require_host = RoleChecker("host", "admin")

        @router.post("/my-properties")
        async def create(user = Depends(require_host)):
            ...
    """

    def __init__(self, *allowed_roles: str) -> None:
        self.allowed_roles = set(allowed_roles)

    async def __call__(
        self,
        current_user: dict = Depends(get_current_user),
    ) -> dict:
        if current_user.get("role") not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Access denied. "
                    f"Required role(s): {', '.join(sorted(self.allowed_roles))}."
                ),
            )
        return current_user


# ── Pre-built role dependencies ────────────────────────────────────
# Import and use these directly in route Depends() calls.

require_guest = RoleChecker("guest", "host", "admin")   # any authenticated user
require_host  = RoleChecker("host", "admin")             # host or admin
require_admin = RoleChecker("admin")                     # admin only
