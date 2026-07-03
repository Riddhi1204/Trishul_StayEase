"""
database/connection.py
──────────────────────
Motor (async) MongoDB client for Trishul StayEase.

Usage
-----
Call `connect_to_mongo()` on app startup and `close_mongo_connection()`
on shutdown. Use `get_database()` inside route handlers to get the
`AsyncIOMotorDatabase` instance.
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from dotenv import load_dotenv

load_dotenv()

MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME:   str = os.getenv("DB_NAME",   "trishul_stayease")

# Module-level client — initialised in connect_to_mongo()
_client: AsyncIOMotorClient | None = None


async def connect_to_mongo() -> None:
    """Open the Motor client and verify the connection with a ping."""
    global _client
    _client = AsyncIOMotorClient(
        MONGO_URI,
        serverSelectionTimeoutMS=8000,  # fail fast if Atlas unreachable
    )
    # Ping forces an actual network round-trip — catches bad credentials early
    await _client.admin.command("ping")


async def close_mongo_connection() -> None:
    """Close the Motor client gracefully on app shutdown."""
    global _client
    if _client is not None:
        _client.close()
        _client = None


def get_database() -> AsyncIOMotorDatabase:
    """Return the application database handle."""
    if _client is None:
        raise RuntimeError(
            "MongoDB client is not initialised. "
            "Ensure connect_to_mongo() was called during app startup."
        )
    return _client[DB_NAME]
