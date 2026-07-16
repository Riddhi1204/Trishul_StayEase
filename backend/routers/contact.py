from fastapi import APIRouter, Depends, HTTPException, status, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from database.deps import get_db
from database import crud
from models import ContactCreate
from security.rate_limit import limiter

router = APIRouter(prefix="/api/contact", tags=["Contact"])

@router.post("", status_code=status.HTTP_201_CREATED, summary="Submit a contact form message")
@limiter.limit("5/minute")
async def submit_contact(
    request: Request,
    body: ContactCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Store a new contact form submission in the database.
    Rate limited to 5 requests per minute to prevent spam.
    """
    try:
        await crud.create_contact_message(db, body.model_dump())
        return {"status": "success", "message": "Your message has been sent successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit contact message. Please try again later."
        )
