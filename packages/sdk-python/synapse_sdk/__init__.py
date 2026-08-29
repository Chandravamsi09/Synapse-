"""
Synapse Python Client SDK
"""

from .client import SynapseClient
from .exceptions import SynapseError, AuthenticationError, RateLimitError

__version__ = "1.0.0"
__all__ = ["SynapseClient", "SynapseError", "AuthenticationError", "RateLimitError"]
