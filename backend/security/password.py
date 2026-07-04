"""
security/password.py
────────────────────
Password hashing and verification using Passlib + bcrypt.

Never call bcrypt directly — always use these two functions.
"""

import logging
import warnings

# Suppress passlib's version-check warning on bcrypt 4.x
# (runtime behaviour is correct; this is purely a version-detection quirk)
warnings.filterwarnings("ignore", ".*bcrypt.*")
logging.getLogger("passlib").setLevel(logging.ERROR)

from passlib.context import CryptContext

# Single CryptContext for the entire application.
# "deprecated=auto" means older hashes are flagged for rehashing automatically.
_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    """Return the bcrypt hash of a plain-text password."""
    return _pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """
    Verify a plain-text password against a stored bcrypt hash.
    Returns True if they match, False otherwise.
    """
    return _pwd_context.verify(plain, hashed)
