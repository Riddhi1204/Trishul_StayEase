"""
security/config.py
──────────────────
JWT configuration loaded from environment variables.

Structured so refresh token support can be added without refactoring:
  ACCESS_TOKEN_EXPIRE_MINUTES  — short-lived access token
  REFRESH_TOKEN_EXPIRE_DAYS    — longer-lived refresh token (Phase 2)
"""

import os
from dotenv import load_dotenv

load_dotenv()


class JWTSettings:
    """
    Centralised JWT configuration.
    All token-related parameters live here — no scattered os.getenv() calls.
    """
    SECRET: str = os.getenv("JWT_SECRET", "CHANGE_THIS_INSECURE_DEFAULT")
    ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

    # Access token: 7 days (10080 minutes) for development and testing
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("JWT_EXPIRE_MINUTES", "10080")
    )

    # Placeholder for refresh tokens — wired in without touching this file
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(
        os.getenv("JWT_REFRESH_EXPIRE_DAYS", "30")
    )

    def validate(self) -> None:
        """Warn loudly if the default insecure secret is still in use."""
        if self.SECRET == "CHANGE_THIS_INSECURE_DEFAULT":
            import warnings
            warnings.warn(
                "JWT_SECRET is using the insecure default. "
                "Set a strong secret in your .env file.",
                RuntimeWarning,
                stacklevel=2,
            )


# Singleton instance — import this everywhere
jwt_settings = JWTSettings()
