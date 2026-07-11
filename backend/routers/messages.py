from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from bson import ObjectId

from database.deps import get_db
from database import crud
from auth.dependencies import get_current_user
from models import MessageCreate, MessageResponse, ErrorResponse

router = APIRouter(prefix="/api/messages", tags=["Messages"])

@router.get("/inbox", summary="Get user's inbox with latest messages per booking")
async def get_inbox(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Get all unique bookings that the user is a part of (as guest or host)
    and their latest message.
    """
    user_id = current_user["id"]
    
    # Find all bookings where user is either guest or host (host requires joining with properties, 
    # but since bookings don't store host_id directly, we find properties first if user is host)
    
    if current_user["role"] == "host":
        properties = await crud.get_properties_by_host(db, user_id)
        prop_ids = [p["id"] for p in properties]
        bookings_cursor = db[crud.BOOKINGS_COLLECTION].find({"property_id": {"$in": prop_ids}})
    else:
        bookings_cursor = db[crud.BOOKINGS_COLLECTION].find({"guest_id": user_id})
        
    inbox = []
    async for b in bookings_cursor:
        b_id = str(b["_id"])
        
        # Get the latest message for this booking
        latest_msg = await db[crud.MESSAGES_COLLECTION].find_one(
            {"booking_id": b_id}, 
            sort=[("created_at", -1)]
        )
        
        prop = await crud.get_property_by_id(db, b["property_id"])
        
        # Calculate unread count
        unread_count = await db[crud.MESSAGES_COLLECTION].count_documents({
            "booking_id": b_id, 
            "receiver_id": user_id, 
            "read": False
        })
        
        inbox.append({
            "booking_id": b_id,
            "property": prop,
            "latest_message": {
                "message": latest_msg["message"],
                "created_at": latest_msg["created_at"],
                "sender_id": latest_msg["sender_id"]
            } if latest_msg else None,
            "unread_count": unread_count,
            "other_party_id": b["guest_id"] if current_user["role"] == "host" else (prop["host_id"] if prop else "")
        })
        
    # Sort by latest message date (or booking creation if no message)
    inbox.sort(
        key=lambda x: x["latest_message"]["created_at"] if x["latest_message"] else b.get("created_at"), 
        reverse=True
    )
    
    return inbox

@router.get("/conversation/{booking_id}", response_model=List[MessageResponse], summary="Get messages for a booking")
async def get_conversation(
    booking_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get all messages for a specific booking and mark unread messages as read."""
    # 1. Verify user is part of booking
    booking = await db[crud.BOOKINGS_COLLECTION].find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    prop = await crud.get_property_by_id(db, booking["property_id"])
    
    is_guest = booking["guest_id"] == current_user["id"]
    is_host = prop and prop["host_id"] == current_user["id"]
    
    if not (is_guest or is_host):
        raise HTTPException(status_code=403, detail="Not authorized to view this conversation")
        
    # Mark messages as read
    await crud.mark_messages_read(db, booking_id, current_user["id"])
    
    messages = await crud.get_conversation(db, booking_id)
    return messages

@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED, summary="Send a message")
async def send_message(
    body: MessageCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Send a message within a booking conversation."""
    booking = await db[crud.BOOKINGS_COLLECTION].find_one({"_id": ObjectId(body.booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    prop = await crud.get_property_by_id(db, booking["property_id"])
    
    is_guest = booking["guest_id"] == current_user["id"]
    is_host = prop and prop["host_id"] == current_user["id"]
    
    if not (is_guest or is_host):
        raise HTTPException(status_code=403, detail="Not authorized to send messages in this conversation")
        
    # Determine receiver
    receiver_id = prop["host_id"] if is_guest else booking["guest_id"]
    
    msg = await crud.create_message(
        db=db,
        booking_id=body.booking_id,
        sender_id=current_user["id"],
        receiver_id=receiver_id,
        property_id=booking["property_id"],
        message=body.message
    )
    
    return msg
