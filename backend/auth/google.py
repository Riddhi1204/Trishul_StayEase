"""
auth/google.py
──────────────
Google OAuth token verification and integration logic.
"""

import os
from datetime import datetime, timezone

from fastapi import HTTPException, status
from google.oauth2 import id_token
from google.auth.transport import requests
from motor.motor_asyncio import AsyncIOMotorDatabase

from database.crud import get_user_by_email, create_user
from security.jwt import create_access_token

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

async def verify_google_token_and_login(db: AsyncIOMotorDatabase, token: str, role: str) -> dict:
    """
    Verifies a Google ID token.
    If the user doesn't exist, creates a new user.
    Returns the JWT token + user profile.
    """
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth is not configured on the server."
        )

    try:
        # Verify token with Google's public keys
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        
        # Verify issuer
        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Wrong issuer.")
            
        email = idinfo["email"].lower().strip()
        name = idinfo.get("name", "").strip()
        picture = idinfo.get("picture", None)
        
    except ValueError as e:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )

    # Check if user already exists
    user = await get_user_by_email(db, email)
    
    if not user:
        # Create new user
        now = datetime.now(timezone.utc)
        host_status = "pending" if role == "host" else None
        
        user_doc = {
            "fullName": name or "Google User",
            "email": email,
            "passwordHash": None, # No password for Google users
            "role": role,
            "authProvider": "google",
            "hostStatus": host_status,
            "profileImage": picture,
            "createdAt": now,
            "updatedAt": now,
        }
        user = await create_user(db, user_doc)
    else:
        # User exists, optionally update their authProvider or profile image
        # For simplicity, we just log them in. If they were a local user, they can still login with Google.
        pass

    # Create our application JWT
    access_token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
        "role": user["role"],
    })

    return {"token": access_token, "user": user}
