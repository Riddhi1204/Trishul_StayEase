from pydantic import BaseModel, Field
from typing import Literal, Optional


# ── Request schemas ──────────────────────────────────────────────

class PropertyCreate(BaseModel):
    """Schema for creating a new property."""
    title:    str   = Field(..., min_length=1, max_length=200, example="Mountain Retreat")
    location: str   = Field(..., min_length=1, max_length=200, example="Munsiyari, Uttarakhand")
    price:    int   = Field(..., gt=0,                         example=3200)
    type:     str   = Field(..., min_length=1,                 example="mountain")
    status:   str   = Field(...,                               example="available")


class PropertyUpdate(BaseModel):
    """Schema for partially updating a property — all fields optional."""
    title:    Optional[str] = Field(None, min_length=1, max_length=200)
    location: Optional[str] = Field(None, min_length=1, max_length=200)
    price:    Optional[int] = Field(None, gt=0)
    type:     Optional[str] = Field(None, min_length=1)
    status:   Optional[str] = None


# ── Response schemas ─────────────────────────────────────────────

class PropertyResponse(BaseModel):
    """Full property object returned by the API."""
    id:       int
    title:    str
    location: str
    price:    int
    type:     str
    status:   str

    model_config = {"from_attributes": True}


# ── Error schema ─────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    """Standard error envelope."""
    detail: str
