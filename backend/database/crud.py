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
from datetime import datetime, timezone
from typing import List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument

# ── Collection names ──────────────────────────────────────────────────
PROPERTIES_COLLECTION = "properties"
COUNTERS_COLLECTION   = "counters"
USERS_COLLECTION      = "users"

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
    """Create indexes for properties and users collections."""
    # Properties
    col = db[PROPERTIES_COLLECTION]
    await col.create_index("id",       unique=True)
    await col.create_index("type")
    await col.create_index("status")
    await col.create_index("price")
    await col.create_index([("title", 1), ("location", 1)])

    # Users — unique email and phone enforced at database level
    users_col = db[USERS_COLLECTION]
    await users_col.create_index("email", unique=True)
    await users_col.create_index("phone", unique=True)
    await users_col.create_index("role")


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


async def get_properties_by_host(
    db: AsyncIOMotorDatabase, host_id: str
) -> List[dict]:
    """Return properties owned by a specific host."""
    cursor = db[PROPERTIES_COLLECTION].find({"host_id": host_id}, _EXCLUDE_ID).sort("id", 1)
    return await cursor.to_list(length=None)


async def get_property_by_id(
    db: AsyncIOMotorDatabase, property_id: int
) -> Optional[dict]:
    """Return one property by its integer id, or None if not found."""
    return await db[PROPERTIES_COLLECTION].find_one(
        {"id": property_id}, _EXCLUDE_ID
    )


async def create_property(db: AsyncIOMotorDatabase, data: dict, host_id: str) -> dict:
    """
    Insert a new property document.
    Assigns the next auto-increment id, attaches host_id and timestamps, 
    and returns the created document.
    """
    new_id  = await get_next_id(db)
    now = datetime.now(timezone.utc).isoformat()
    
    new_doc = {
        "id": new_id,
        "host_id": host_id,
        **data,
        "createdAt": now,
        "updatedAt": now
    }
    
    await db[PROPERTIES_COLLECTION].insert_one(new_doc)
    new_doc.pop("_id", None)   # remove ObjectId before returning
    return new_doc


async def update_property(
    db: AsyncIOMotorDatabase, property_id: int, data: dict
) -> Optional[dict]:
    """
    Apply a partial update ($set) to an existing property.
    Automatically updates the updatedAt timestamp.
    Returns the updated document, or None if not found.
    """
    data["updatedAt"] = datetime.now(timezone.utc).isoformat()
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


# ── User CRUD ──────────────────────────────────────────────────
# Users use MongoDB ObjectId as primary key (converted to string).
# passwordHash is NEVER returned by public-facing functions.

def _clean_user(doc: dict, include_password: bool = False) -> Optional[dict]:
    """
    Convert a raw MongoDB user document to an API-safe dict.
    - Converts ObjectId _id -> string id
    - Strips passwordHash unless include_password=True (auth service only)
    """
    if doc is None:
        return None
    doc["id"] = str(doc["_id"])
    doc.pop("_id")
    if not include_password:
        doc.pop("passwordHash", None)
    return doc


async def create_user(db: AsyncIOMotorDatabase, data: dict) -> dict:
    """Insert a new user. Returns created user WITHOUT passwordHash."""
    result = await db[USERS_COLLECTION].insert_one(data)
    doc    = await db[USERS_COLLECTION].find_one({"_id": result.inserted_id})
    return _clean_user(doc)


async def get_user_by_email(
    db: AsyncIOMotorDatabase,
    email: str,
    include_password: bool = False,
) -> Optional[dict]:
    """
    Find a user by email.
    Set include_password=True only inside auth service for credential verification.
    """
    doc = await db[USERS_COLLECTION].find_one({"email": email.lower()})
    return _clean_user(doc, include_password=include_password)


async def update_user(
    db: AsyncIOMotorDatabase,
    user_id: str,
    data: dict,
) -> Optional[dict]:
    """
    Apply a partial update ($set) to an existing user.
    """
    from bson import ObjectId
    try:
        oid = ObjectId(user_id)
    except Exception:
        return None
    
    data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    doc = await db[USERS_COLLECTION].find_one_and_update(
        {"_id": oid},
        {"$set": data},
        return_document=ReturnDocument.AFTER,
    )
    return _clean_user(doc)


async def get_user_by_id(
    db: AsyncIOMotorDatabase,
    user_id: str,
) -> Optional[dict]:
    """Find a user by ObjectId string. Returns user WITHOUT passwordHash."""
    from bson import ObjectId
    try:
        oid = ObjectId(user_id)
    except Exception:
        return None
    doc = await db[USERS_COLLECTION].find_one({"_id": oid})
    return _clean_user(doc)


async def get_user_by_phone(
    db: AsyncIOMotorDatabase,
    phone: str,
) -> Optional[dict]:
    """Find a user by phone number. Used for uniqueness check on registration."""
    doc = await db[USERS_COLLECTION].find_one({"phone": phone})
    return _clean_user(doc)
