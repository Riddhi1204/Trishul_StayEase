"""
auth/schemas.py
───────────────
Pydantic v2 schemas for authentication endpoints.

Kept separate from models.py (property schemas) to preserve modularity.
"""

import re
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


# ── Request schemas ───────────────────────────────────────────────

class UserCreate(BaseModel):
    """Schema for POST /auth/register."""
    fullName: str = Field(
        ...,
        min_length=2,
        max_length=100,
        examples=["Ananya Joshi"],
    )
    email: EmailStr = Field(..., examples=["ananya@example.com"])
    phone: str = Field(..., examples=["+919876543210"])
    password: str = Field(..., min_length=8, examples=["SecurePass@123"])
    confirmPassword: str = Field(..., examples=["SecurePass@123"])
    role: Literal["guest", "host"] = Field(
        default="guest",
        description="Users can self-register as 'guest' or 'host'. Admin role is assigned manually.",
    )

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-\(\)]", "", v)
        if not re.match(r"^\+?[\d]{10,15}$", cleaned):
            raise ValueError("Enter a valid phone number (10–15 digits, optional + prefix).")
        return cleaned

    @field_validator("fullName")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Full name cannot be blank.")
        return v.strip()

    @model_validator(mode="after")
    def passwords_match(self) -> "UserCreate":
        if self.password != self.confirmPassword:
            raise ValueError("Passwords do not match.")
        return self


class UserLogin(BaseModel):
    """Schema for POST /auth/login."""
    email: EmailStr = Field(..., examples=["ananya@example.com"])
    password: str = Field(..., examples=["SecurePass@123"])


# ── Response schemas ──────────────────────────────────────────────

class UserResponse(BaseModel):
    """Public user profile — passwordHash is never included."""
    id: str
    fullName: str
    email: str
    phone: str
    role: str
    profileImage: Optional[str] = None
    createdAt: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """Response body for successful login and registration."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    """Generic success message envelope."""
    message: str
