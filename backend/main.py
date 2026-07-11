"""
Trishul StayEase — FastAPI Backend
Phase 1: Authentication & Security added

Property Endpoints  (URLs and response shapes unchanged)
---------
GET    /api/properties              List all properties
GET    /api/properties/search       Search by title or location
GET    /api/properties/filter       Filter by price / type / status
GET    /api/properties/{id}         Get a single property
POST   /api/properties              Create a new property  (201)
PUT    /api/properties/{id}         Update a property      (200)
DELETE /api/properties/{id}         Delete a property      (204)

Auth Endpoints
---------
POST   /auth/register               Register new account   (201)
POST   /auth/login                  Login, returns JWT     (200)
GET    /auth/me                     Current user profile   (200)
"""

import os
from contextlib import asynccontextmanager
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from database.connection import (
    close_mongo_connection,
    connect_to_mongo,
    get_database,
)
from database import crud
from database.deps import get_db
from models import ErrorResponse, PropertyCreate, PropertyResponse, PropertyUpdate
from auth.router import router as auth_router
from auth.dependencies import get_current_user, require_host
from middleware.security import SecurityHeadersMiddleware
from security.rate_limit import limiter

# ── Load environment ──────────────────────────────────────────────
load_dotenv()

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")


# ── Lifespan (startup / shutdown) ─────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Connect to MongoDB, seed data, build indexes on startup; disconnect on shutdown."""
    print("[startup] Connecting to MongoDB Atlas...")
    await connect_to_mongo()
    db = get_database()

    await crud.ensure_indexes(db)
    await crud.seed_if_empty(db)

    # Store db on app.state so the dependency can reach it
    app.state.db = db
    print("[startup] MongoDB Atlas connected - Trishul StayEase API ready.")
    yield
    print("[shutdown] Closing MongoDB connection...")
    await close_mongo_connection()


# ── App ───────────────────────────────────────────────────────────
app = FastAPI(
    title="Trishul StayEase API",
    description=(
        "REST API for the Trishul StayEase eco-homestay booking platform.\n\n"
        "**Phase 1:** JWT Authentication + Role-Based Authorization.\n"
        "**Backend:** MongoDB Atlas via Motor (async driver).\n\n"
        "### Auth endpoints\n"
        "Use `POST /auth/register` or `POST /auth/login` to get a token, "
        "then click **Authorize** (top right) and paste: `Bearer <token>`."
    ),
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── Rate Limiting ─────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# ── Security Headers ──────────────────────────────────────────────
app.add_middleware(SecurityHeadersMiddleware)

# ── CORS ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)


# ── Auth router ──────────────────────────────────────────────────
app.include_router(auth_router)


# ── Root health-check ─────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "Trishul StayEase API is running 🌿"}


@app.get("/health", tags=["Health"])
async def health(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Returns the total number of properties currently stored in MongoDB."""
    from database.crud import PROPERTIES_COLLECTION
    count = await db[PROPERTIES_COLLECTION].count_documents({})
    return {"status": "ok", "storage": "mongodb", "property_count": count}


# ── Search  (defined BEFORE /{id} to prevent routing clash) ───────
@app.get(
    "/api/properties/search",
    response_model=List[PropertyResponse],
    tags=["Properties"],
    summary="Search properties by title or location",
)
async def search_properties(
    q:  str = Query(..., min_length=1, max_length=50, description="Search term matched against title and location"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Case-insensitive substring search.
    Returns all properties whose **title** or **location** contains `q`.
    """
    return await crud.search_properties(db, q)


# ── Filter ────────────────────────────────────────────────────────
@app.get(
    "/api/properties/filter",
    response_model=List[PropertyResponse],
    tags=["Properties"],
    summary="Filter properties by price, type, and/or status",
)
async def filter_properties(
    max_price: Optional[int] = Query(None, gt=0,       description="Maximum price per night (₹)"),
    type:      Optional[str] = Query(None, min_length=1, description="Property type (mountain, forest, etc.)"),
    status:    Optional[str] = Query(None, min_length=1, description="Status: available | booked"),
    db:        AsyncIOMotorDatabase = Depends(get_db),
):
    """Filter properties with optional price ceiling, type, or status."""
    return await crud.filter_properties(
        db,
        max_price=max_price,
        property_type=type,
        status=status,
    )


# ── List all ──────────────────────────────────────────────────────
@app.get(
    "/api/properties",
    response_model=List[PropertyResponse],
    tags=["Properties"],
    summary="List all properties",
)
async def list_properties(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Return every property from MongoDB, sorted by id."""
    return await crud.get_all_properties(db)

# ── Get My Properties (Host) ──────────────────────────────────────
@app.get(
    "/api/properties/me/all",
    response_model=List[PropertyResponse],
    tags=["Properties"],
    summary="List properties owned by the authenticated host",
)
async def get_my_properties(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(require_host)
):
    """Return properties owned by the authenticated host."""
    return await crud.get_properties_by_host(db, current_user["id"])


# ── Get one ───────────────────────────────────────────────────────
@app.get(
    "/api/properties/{property_id}",
    response_model=PropertyResponse,
    responses={404: {"model": ErrorResponse}},
    tags=["Properties"],
    summary="Get a single property by ID",
)
async def get_property(
    property_id: int,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Return a single property or **404** if not found."""
    prop = await crud.get_property_by_id(db, property_id)
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
    responses={400: {"model": ErrorResponse}, 401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
    tags=["Properties"],
    summary="Create a new property",
)
async def create_property(
    body: PropertyCreate,
    db:   AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(require_host)
):
    """
    Insert a new property into MongoDB.
    Requires Host or Admin role.
    Returns **201 Created** with the new document including its assigned `id`.
    """
    # Clean the input data strings
    property_data = body.model_dump()
    for field in ["title", "location", "type", "status", "description", "city", "state", "country"]:
        if property_data.get(field):
            property_data[field] = property_data[field].strip()
            if field in ["type", "status"]:
                property_data[field] = property_data[field].lower()

    new_prop = await crud.create_property(db, property_data, host_id=current_user["id"])
    return new_prop


# ── Update ────────────────────────────────────────────────────────
@app.put(
    "/api/properties/{property_id}",
    response_model=PropertyResponse,
    responses={
        404: {"model": ErrorResponse},
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
    },
    tags=["Properties"],
    summary="Update a property (partial update supported)",
)
async def update_property(
    property_id: int,
    body:        PropertyUpdate,
    db:          AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Partially update an existing property ($set on changed fields only).
    Requires Owner or Admin.
    """
    # 1. Fetch property to check ownership
    existing_prop = await crud.get_property_by_id(db, property_id)
    if not existing_prop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Property {property_id} not found.")

    # 2. Verify authorization (Owner or Admin)
    if current_user["role"] != "admin" and existing_prop.get("host_id") != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to modify this property.")

    update_data = body.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Request body must contain at least one field to update.")

    updated = await crud.update_property(db, property_id, update_data)
    return updated


# ── Delete ────────────────────────────────────────────────────────
@app.delete(
    "/api/properties/{property_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={404: {"model": ErrorResponse}, 401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
    tags=["Properties"],
    summary="Delete a property",
)
async def delete_property(
    property_id: int,
    db:          AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Permanently remove a property from MongoDB.
    Requires Owner or Admin.
    """
    # 1. Fetch property to check ownership
    existing_prop = await crud.get_property_by_id(db, property_id)
    if not existing_prop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Property {property_id} not found.")

    # 2. Verify authorization (Owner or Admin)
    if current_user["role"] != "admin" and existing_prop.get("host_id") != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this property.")

    await crud.delete_property(db, property_id)
    return None


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
