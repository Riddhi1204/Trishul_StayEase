"""
security/jwt.py
───────────────
JWT token creation and verification using python-jose.

Token payload structure:
  {
    "sub":   "<user_id>",    # MongoDB _id as string
    "email": "<email>",
    "role":  "<role>",
    "type":  "access",       # distinguishes access vs refresh (Phase 2)
    "exp":   <unix_timestamp>
  }
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt

from security.config import jwt_settings


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a signed JWT access token.

    Args:
        data:          Payload dict. Must include "sub" (user id).
        expires_delta: Custom TTL. Defaults to JWT_EXPIRE_MINUTES from config.

    Returns:
        Encoded JWT string.
    """
    payload = data.copy()
    payload["type"] = "access"

    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(minutes=jwt_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload["exp"] = expire

    return jwt.encode(
        payload,
        jwt_settings.SECRET,
        algorithm=jwt_settings.ALGORITHM,
    )


def create_refresh_token(data: dict) -> str:
    """
    Placeholder for Phase 2 — creates a longer-lived refresh token.
    Structured so the router can call it without refactoring this module.
    """
    payload = data.copy()
    payload["type"] = "refresh"
    expire = datetime.now(timezone.utc) + timedelta(
        days=jwt_settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload["exp"] = expire

    return jwt.encode(
        payload,
        jwt_settings.SECRET,
        algorithm=jwt_settings.ALGORITHM,
    )


def verify_token(token: str) -> dict:
    """
    Decode and validate a JWT token.

    Returns:
        Decoded payload dict.

    Raises:
        jose.JWTError: if the token is invalid, expired, or tampered with.
    """
    return jwt.decode(
        token,
        jwt_settings.SECRET,
        algorithms=[jwt_settings.ALGORITHM],
    )
