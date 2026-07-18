from pydantic import BaseModel, Field
from typing import List, Optional

class TravelPlanRequest(BaseModel):
    destination: str = Field(..., min_length=2, max_length=100)
    days: int = Field(..., ge=1, le=14)
    budget: str = Field(..., min_length=2, max_length=50)
    travel_style: str = Field(..., min_length=3, max_length=50)
    guests: int = Field(..., ge=1, le=20)
    special_requests: Optional[str] = Field(None, max_length=500)

class DailyItinerary(BaseModel):
    day: int
    title: str
    activities: List[str]

class TravelPlanResponse(BaseModel):
    title: str
    summary: str
    itinerary: List[DailyItinerary]
    estimated_budget: str
    packing_list: List[str]
    eco_tips: List[str]
    recommended_stays: List[str]
