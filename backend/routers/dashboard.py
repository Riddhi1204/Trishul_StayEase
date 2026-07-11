from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Dict, Any

from database.deps import get_db
from database import crud
from auth.dependencies import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get(
    "/host",
    summary="Get host dashboard statistics",
)
async def get_host_dashboard_stats(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> Dict[str, Any]:
    if current_user["role"] not in ["host", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only hosts can view dashboard")
        
    host_id = current_user["id"]
    
    properties = await crud.get_properties_by_host(db, host_id)
    bookings = await crud.get_host_bookings(db, host_id)
    
    total_properties = len(properties)
    total_bookings = len(bookings)
    
    # Calculate revenue (completed and upcoming bookings)
    revenue = sum(
        b.get("total_amount", 0) 
        for b in bookings 
        if b.get("status") in ["upcoming", "completed"]
    )
    
    # Simple occupancy calculation: (total bookings / (properties * 30 days)) * 100
    # This is a very rough mock calculation for visual purposes
    total_potential_booking_days = total_properties * 30
    actual_booked_days = sum(
        (b.get("guests", 1)) # just a placeholder mock for days since we don't parse dates
        for b in bookings 
        if b.get("status") in ["upcoming", "completed"]
    ) * 3  # Assume average 3 days per booking
    
    occupancy = 0
    if total_potential_booking_days > 0:
        occupancy = min(100, int((actual_booked_days / total_potential_booking_days) * 100))
        
    # Get 5 most recent bookings
    recent_bookings = bookings[:5]
    for b in recent_bookings:
        # Hydrate property name for the dashboard
        prop = next((p for p in properties if p["id"] == b["property_id"]), None)
        b["property_title"] = prop["title"] if prop else "Unknown Property"
    
    return {
        "totalProperties": total_properties,
        "totalBookings": total_bookings,
        "revenue": revenue,
        "occupancy": occupancy,
        "recentBookings": recent_bookings
    }
