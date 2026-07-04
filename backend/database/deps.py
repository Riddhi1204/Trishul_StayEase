"""
database/deps.py
────────────────
Shared FastAPI dependency for injecting the Motor database handle.

Defined here (not in main.py) so both main.py and auth/ can import it
without circular imports.
"""

from fastapi import Request
from motor.motor_asyncio import AsyncIOMotorDatabase


def get_db(request: Request) -> AsyncIOMotorDatabase:
    """
    FastAPI dependency — injects the Motor database handle.
    The db is stored on app.state during startup (see lifespan in main.py).
    """
    return request.app.state.db
