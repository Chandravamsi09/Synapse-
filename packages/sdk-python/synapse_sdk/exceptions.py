"""
Synapse SDK Exceptions Hierarchy
"""

class SynapseError(Exception):
    """Base exception for all Synapse SDK errors."""
    pass

class AuthenticationError(SynapseError):
    """Raised when API Key or token validation fails."""
    pass

class RateLimitError(SynapseError):
    """Raised when rate limits are exceeded."""
    def __init__(self, message: str, reset_seconds: int = 60):
        super().__init__(message)
        self.reset_seconds = reset_seconds
