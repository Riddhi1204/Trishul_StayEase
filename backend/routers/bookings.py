from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from database.deps import get_db
from database import crud
from auth.dependencies import get_current_user
from models import BookingCreate, BookingResponse, ErrorResponse

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post(
    "",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new booking",
)
async def create_booking(
    data: BookingCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "guest":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only guests can make bookings")
        
    prop = await crud.get_property_by_id(db, data.property_id)
    if not prop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        
    booking_doc = data.model_dump()
    booking_doc["guest_id"] = current_user["id"]
    booking_doc["host_id"] = prop.get("host_id", "")
    booking_doc["status"] = "upcoming"
    booking_doc["payment_status"] = "pending"
    
    new_booking = await crud.create_booking(db, booking_doc)
    new_booking["property"] = prop
    return new_booking

@router.get(
    "/me",
    response_model=List[BookingResponse],
    summary="Get guest's bookings",
)
async def get_my_bookings(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "guest":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only guests have a booking history")
        
    bookings = await crud.get_guest_bookings(db, current_user["id"])
    
    # Hydrate property details
    for b in bookings:
        prop = await crud.get_property_by_id(db, b["property_id"])
        if prop:
            b["property"] = prop
            
    return bookings

@router.get(
    "/host",
    response_model=List[BookingResponse],
    summary="Get host's bookings",
)
async def get_host_bookings(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] not in ["host", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only hosts can view their received bookings")
        
    bookings = await crud.get_host_bookings(db, current_user["id"])
    
    # Hydrate property details
    for b in bookings:
        prop = await crud.get_property_by_id(db, b["property_id"])
        if prop:
            b["property"] = prop
            
    return bookings

@router.put(
    "/{booking_id}/status",
    response_model=BookingResponse,
    summary="Update booking status (cancel/approve)",
)
async def update_status(
    booking_id: str,
    status_update: dict,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    new_status = status_update.get("status")
    if new_status not in ["upcoming", "cancelled", "completed", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    booking = await crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if current_user["role"] == "guest":
        if booking["guest_id"] != current_user["id"] or new_status != "cancelled":
            raise HTTPException(status_code=403, detail="Guests can only cancel their own bookings")
    elif current_user["role"] == "host":
        if booking["host_id"] != current_user["id"]:
            raise HTTPException(status_code=403, detail="Not authorized")
            
    updated = await crud.update_booking_status(db, booking_id, new_status, current_user["id"], current_user["role"])
    
    prop = await crud.get_property_by_id(db, updated["property_id"])
    if prop:
        updated["property"] = prop
        
    return updated
