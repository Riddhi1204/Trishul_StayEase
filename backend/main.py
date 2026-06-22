"""
Trishul StayEase — FastAPI Backend
Week 4: REST API with in-memory storage

Endpoints
---------
GET    /api/properties              List all properties
GET    /api/properties/search       Search properties by title or location
GET    /api/properties/filter       Filter properties by max price
GET    /api/properties/{id}         Get a single property
POST   /api/properties              Create a new property  (201)
PUT    /api/properties/{id}         Update a property      (200)
DELETE /api/properties/{id}         Delete a property      (204)
"""

import os
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models import ErrorResponse, PropertyCreate, PropertyResponse, PropertyUpdate

# ── Load environment ──────────────────────────────────────────────
load_dotenv()

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

# ── App ───────────────────────────────────────────────────────────
app = FastAPI(
    title="Trishul StayEase API",
    description="REST API for the Trishul StayEase eco-homestay booking platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory datastore ───────────────────────────────────────────
_id_counter: int = 8   # next ID to assign

properties: List[dict] = [
    {"id": 1, "title": "Mountain Retreat",     "location": "Munsiyari, Uttarakhand",    "price": 3200, "type": "mountain",  "status": "available"},
    {"id": 2, "title": "Forest Cabin",         "location": "Coorg, Karnataka",          "price": 2800, "type": "forest",    "status": "available"},
    {"id": 3, "title": "Riverside Homestay",   "location": "Rishikesh, Uttarakhand",    "price": 2400, "type": "riverside", "status": "available"},
    {"id": 4, "title": "Valley Farmstay",      "location": "Manali, Himachal Pradesh",  "price": 1900, "type": "mountain",  "status": "available"},
    {"id": 5, "title": "Coastal Eco Lodge",    "location": "Varkala, Kerala",           "price": 3500, "type": "coastal",   "status": "available"},
    {"id": 6, "title": "Himalayan Bungalow",   "location": "Kasol, Himachal Pradesh",   "price": 4200, "type": "mountain",  "status": "booked"},
    {"id": 7, "title": "Bamboo Hut Resort",    "location": "Wayanad, Kerala",           "price": 2100, "type": "forest",    "status": "available"},
]


def _find(property_id: int) -> Optional[dict]:
    """Return the property dict with the given id, or None."""
    return next((p for p in properties if p["id"] == property_id), None)


def _next_id() -> int:
    global _id_counter
    _id_counter += 1
    return _id_counter


# ── Root health-check ─────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Trishul StayEase API is running 🌿"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "properties_in_memory": len(properties)}


# ── Search  (must be defined BEFORE /{id} to avoid routing clash) ─
@app.get(
    "/api/properties/search",
    response_model=List[PropertyResponse],
    tags=["Properties"],
    summary="Search properties by title or location",
)
def search_properties(
    q: str = Query(..., min_length=1, description="Search term matched against title and location"),
):
    """
    Returns all properties whose **title** or **location** contains the
    search term (case-insensitive).
    """
    q_lower = q.strip().lower()
    results = [
        p for p in properties
        if q_lower in p["title"].lower() or q_lower in p["location"].lower()
    ]
    return results


# ── Filter ────────────────────────────────────────────────────────
@app.get(
    "/api/properties/filter",
    response_model=List[PropertyResponse],
    tags=["Properties"],
    summary="Filter properties by maximum price and/or type",
)
def filter_properties(
    max_price: Optional[int]  = Query(None, gt=0,      description="Maximum price per night (₹)"),
    type:      Optional[str]  = Query(None, min_length=1, description="Property type (mountain, forest, etc.)"),
    status:    Optional[str]  = Query(None, min_length=1, description="Status: available | booked"),
):
    """Filter properties with optional price ceiling, type, or status."""
    results = properties
    if max_price is not None:
        results = [p for p in results if p["price"] <= max_price]
    if type is not None:
        results = [p for p in results if p["type"].lower() == type.lower()]
    if status is not None:
        results = [p for p in results if p["status"].lower() == status.lower()]
    return results


# ── List all ──────────────────────────────────────────────────────
@app.get(
    "/api/properties",
    response_model=List[PropertyResponse],
    tags=["Properties"],
    summary="List all properties",
)
def list_properties():
    """Return the full list of properties."""
    return properties


# ── Get one ───────────────────────────────────────────────────────
@app.get(
    "/api/properties/{property_id}",
    response_model=PropertyResponse,
    responses={404: {"model": ErrorResponse}},
    tags=["Properties"],
    summary="Get a single property by ID",
)
def get_property(property_id: int):
    """Return a single property or **404** if not found."""
    prop = _find(property_id)
    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with id={property_id} not found.",
        )
    return prop


# ── Create ────────────────────────────────────────────────────────
@app.post(
    "/api/properties",
    response_model=PropertyResponse,
    status_code=status.HTTP_201_CREATED,
    responses={400: {"model": ErrorResponse}},
    tags=["Properties"],
    summary="Create a new property",
)
def create_property(body: PropertyCreate):
    """
    Create a new property listing.
    Returns **201 Created** with the new property object (including assigned `id`).
    """
    new_prop = {
        "id":       _next_id(),
        "title":    body.title.strip(),
        "location": body.location.strip(),
        "price":    body.price,
        "type":     body.type.strip().lower(),
        "status":   body.status.strip().lower(),
    }
    properties.append(new_prop)
    return new_prop


# ── Update ────────────────────────────────────────────────────────
@app.put(
    "/api/properties/{property_id}",
    response_model=PropertyResponse,
    responses={
        404: {"model": ErrorResponse},
        400: {"model": ErrorResponse},
    },
    tags=["Properties"],
    summary="Update a property (partial update supported)",
)
def update_property(property_id: int, body: PropertyUpdate):
    """
    Update one or more fields of an existing property.
    Only the fields present in the request body are updated.
    Returns **404** if the property does not exist.
    """
    prop = _find(property_id)
    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with id={property_id} not found.",
        )

    update_data = body.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request body must contain at least one field to update.",
        )

    prop.update(update_data)
    return prop


# ── Delete ────────────────────────────────────────────────────────
@app.delete(
    "/api/properties/{property_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={404: {"model": ErrorResponse}},
    tags=["Properties"],
    summary="Delete a property",
)
def delete_property(property_id: int):
    """
    Remove a property from the store.
    Returns **204 No Content** on success, **404** if not found.
    """
    prop = _find(property_id)
    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with id={property_id} not found.",
        )
    properties.remove(prop)
    return None   # 204 — no body


# ── Global exception handler ──────────────────────────────────────
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected server error occurred. Please try again."},
    )


# ── Entry point ───────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=True,
    )
