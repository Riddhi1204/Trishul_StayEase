from pydantic import BaseModel, Field
from typing import Literal, Optional


# ── Request schemas ──────────────────────────────────────────────

class PropertyCreate(BaseModel):
    """Schema for creating a new property."""
    title:       str            = Field(..., min_length=1, max_length=200, example="Mountain Retreat")
    description: Optional[str]  = Field("", example="A beautiful retreat...")
    location:    str            = Field(..., min_length=1, max_length=200, example="Munsiyari, Uttarakhand")
    city:        Optional[str]  = Field("", example="Munsiyari")
    state:       Optional[str]  = Field("", example="Uttarakhand")
    country:     Optional[str]  = Field("India", example="India")
    price:       int            = Field(..., gt=0, example=3200)
    type:        str            = Field(..., min_length=1, example="mountain")
    status:      str            = Field("available", example="available")
    amenities:   list[str]      = Field(default_factory=list, example=["WiFi", "Kitchen"])
    images:      list[str]      = Field(default_factory=list, example=["https://example.com/image.jpg"])


class PropertyUpdate(BaseModel):
    """Schema for partially updating a property — all fields optional."""
    title:       Optional[str]       = Field(None, min_length=1, max_length=200)
    description: Optional[str]       = Field(None)
    location:    Optional[str]       = Field(None, min_length=1, max_length=200)
    city:        Optional[str]       = Field(None)
    state:       Optional[str]       = Field(None)
    country:     Optional[str]       = Field(None)
    price:       Optional[int]       = Field(None, gt=0)
    type:        Optional[str]       = Field(None, min_length=1)
    status:      Optional[str]       = Field(None)
    amenities:   Optional[list[str]] = Field(None)
    images:      Optional[list[str]] = Field(None)


# ── Response schemas ─────────────────────────────────────────────

class PropertyResponse(BaseModel):
    """Full property object returned by the API.

    Fields added in Phase 2 (description, city, state, country, amenities,
    images) carry safe defaults so legacy seed documents that pre-date the
    schema change are still serializable without causing HTTP 500 errors.
    """
    id:          int
    host_id:     Optional[str]      = None
    title:       str
    description: str                = ""
    location:    str
    city:        str                = ""
    state:       str                = ""
    country:     str                = "India"
    price:       int
    type:        str
    status:      str
    amenities:   list[str]          = Field(default_factory=list)
    images:      list[str]          = Field(default_factory=list)
    createdAt:   Optional[str]      = None
    updatedAt:   Optional[str]      = None

    model_config = {"from_attributes": True}


# ── Error schema ─────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    """Standard error envelope."""
    detail: str
