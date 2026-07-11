from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from database.deps import get_db
from database import crud
from auth.dependencies import get_current_user
from models import WishlistResponse, ErrorResponse

router = APIRouter(prefix="/api/wishlist", tags=["Wishlists"])

@router.get(
    "",
    response_model=WishlistResponse,
    summary="Get current guest's wishlist",
)
async def get_wishlist(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "guest":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only guests have wishlists")
        
    wishlist = await crud.get_wishlist(db, current_user["id"])
    
    # Hydrate property details
    props = []
    for pid in wishlist.get("property_ids", []):
        p = await crud.get_property_by_id(db, pid)
        if p:
            props.append(p)
    wishlist["properties"] = props
    
    return wishlist

@router.post(
    "/{property_id}",
    response_model=WishlistResponse,
    summary="Add property to wishlist",
)
async def add_to_wishlist(
    property_id: int,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "guest":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only guests have wishlists")
        
    prop = await crud.get_property_by_id(db, property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
        
    wishlist = await crud.add_to_wishlist(db, current_user["id"], property_id)
    return wishlist

@router.delete(
    "/{property_id}",
    response_model=WishlistResponse,
    summary="Remove property from wishlist",
)
async def remove_from_wishlist(
    property_id: int,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "guest":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only guests have wishlists")
        
    wishlist = await crud.remove_from_wishlist(db, current_user["id"], property_id)
    return wishlist
