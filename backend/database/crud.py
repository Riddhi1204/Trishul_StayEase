"""
database/crud.py
────────────────
All async CRUD operations for the `properties` collection.

Every function accepts an `AsyncIOMotorDatabase` instance as its first
argument so routes can inject it via FastAPI's dependency system.

MongoDB document shape
----------------------
{
    "_id":      ObjectId   (internal, never sent to the client)
    "id":       int        (auto-increment integer, exposed to frontend)
    "title":    str
    "location": str
    "price":    int
    "type":     str
    "status":   str
}

A separate `counters` collection stores the auto-increment sequence:
{
    "_id": "property_id",
    "seq": int             (current max id)
}
"""

import re
from typing import List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument

# ── Collection names ──────────────────────────────────────────────
PROPERTIES_COLLECTION = "properties"
COUNTERS_COLLECTION   = "counters"

# ── Projection — always exclude MongoDB's internal _id from responses
_EXCLUDE_ID = {"_id": 0}

# ── Seed data (mirrors the original in-memory list) ───────────────
SEED_DATA: List[dict] = [
    {"id": 1, "title": "Mountain Retreat",   "location": "Munsiyari, Uttarakhand",   "price": 3200, "type": "mountain",  "status": "available"},
    {"id": 2, "title": "Forest Cabin",       "location": "Coorg, Karnataka",         "price": 2800, "type": "forest",    "status": "available"},
    {"id": 3, "title": "Riverside Homestay", "location": "Rishikesh, Uttarakhand",   "price": 2400, "type": "riverside", "status": "available"},
    {"id": 4, "title": "Valley Farmstay",    "location": "Manali, Himachal Pradesh", "price": 1900, "type": "mountain",  "status": "available"},
    {"id": 5, "title": "Coastal Eco Lodge",  "location": "Varkala, Kerala",          "price": 3500, "type": "coastal",   "status": "available"},
    {"id": 6, "title": "Himalayan Bungalow", "location": "Kasol, Himachal Pradesh",  "price": 4200, "type": "mountain",  "status": "booked"},
    {"id": 7, "title": "Bamboo Hut Resort",  "location": "Wayanad, Kerala",          "price": 2100, "type": "forest",    "status": "available"},
]


# ── Startup helpers ───────────────────────────────────────────────

async def ensure_indexes(db: AsyncIOMotorDatabase) -> None:
    """Create indexes for common query patterns."""
    col = db[PROPERTIES_COLLECTION]
    await col.create_index("id",       unique=True)
    await col.create_index("type")
    await col.create_index("status")
    await col.create_index("price")
    await col.create_index([("title", 1), ("location", 1)])


async def seed_if_empty(db: AsyncIOMotorDatabase) -> None:
    """
    Insert the 7 seed properties on first run.
    Skipped if the collection already contains documents.
    Also initialises the auto-increment counter to 7.
    """
    count = await db[PROPERTIES_COLLECTION].count_documents({})
    if count == 0:
        await db[PROPERTIES_COLLECTION].insert_many(SEED_DATA)
        # Initialise the counter so the next assigned id is 8
        await db[COUNTERS_COLLECTION].update_one(
            {"_id": "property_id"},
            {"$set": {"seq": len(SEED_DATA)}},
            upsert=True,
        )


# ── Auto-increment ID ─────────────────────────────────────────────

async def get_next_id(db: AsyncIOMotorDatabase) -> int:
    """
    Atomically increment and return the next property id.
    Uses MongoDB's $inc on the counters collection to prevent duplicates
    under concurrent requests.
    """
    result = await db[COUNTERS_COLLECTION].find_one_and_update(
        {"_id": "property_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return result["seq"]


# ── CRUD operations ───────────────────────────────────────────────

async def get_all_properties(db: AsyncIOMotorDatabase) -> List[dict]:
    """Return every property, sorted by id ascending."""
    cursor = db[PROPERTIES_COLLECTION].find({}, _EXCLUDE_ID).sort("id", 1)
    return await cursor.to_list(length=None)


async def get_property_by_id(
    db: AsyncIOMotorDatabase, property_id: int
) -> Optional[dict]:
    """Return one property by its integer id, or None if not found."""
    return await db[PROPERTIES_COLLECTION].find_one(
        {"id": property_id}, _EXCLUDE_ID
    )


async def create_property(db: AsyncIOMotorDatabase, data: dict) -> dict:
    """
    Insert a new property document.
    Assigns the next auto-increment id and returns the created document.
    """
    new_id  = await get_next_id(db)
    new_doc = {"id": new_id, **data}
    await db[PROPERTIES_COLLECTION].insert_one(new_doc)
    new_doc.pop("_id", None)   # remove ObjectId before returning
    return new_doc


async def update_property(
    db: AsyncIOMotorDatabase, property_id: int, data: dict
) -> Optional[dict]:
    """
    Apply a partial update ($set) to an existing property.
    Returns the updated document, or None if not found.
    """
    return await db[PROPERTIES_COLLECTION].find_one_and_update(
        {"id": property_id},
        {"$set": data},
        projection=_EXCLUDE_ID,
        return_document=ReturnDocument.AFTER,
    )


async def delete_property(db: AsyncIOMotorDatabase, property_id: int) -> bool:
    """
    Delete a property by id.
    Returns True if a document was deleted, False if it didn't exist.
    """
    result = await db[PROPERTIES_COLLECTION].delete_one({"id": property_id})
    return result.deleted_count > 0


async def search_properties(
    db: AsyncIOMotorDatabase, q: str
) -> List[dict]:
    """
    Case-insensitive substring search across title and location.
    Uses a compiled regex for MongoDB $or query.
    """
    pattern = re.compile(re.escape(q.strip()), re.IGNORECASE)
    cursor  = db[PROPERTIES_COLLECTION].find(
        {"$or": [{"title": pattern}, {"location": pattern}]},
        _EXCLUDE_ID,
    ).sort("id", 1)
    return await cursor.to_list(length=None)


async def filter_properties(
    db:            AsyncIOMotorDatabase,
    max_price:     Optional[int] = None,
    property_type: Optional[str] = None,
    status:        Optional[str] = None,
) -> List[dict]:
    """
    Filter properties by any combination of price ceiling, type, and status.
    All parameters are optional.
    """
    query: dict = {}

    if max_price is not None:
        query["price"] = {"$lte": max_price}
    if property_type is not None:
        query["type"] = property_type.strip().lower()
    if status is not None:
        query["status"] = status.strip().lower()

    cursor = db[PROPERTIES_COLLECTION].find(query, _EXCLUDE_ID).sort("id", 1)
    return await cursor.to_list(length=None)
