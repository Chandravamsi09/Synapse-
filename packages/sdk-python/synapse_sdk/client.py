"""
Synapse Python Client implementation
"""

import hmac
import hashlib
import time
from typing import Dict, Any, Optional

class SynapseClient:
    def __init__(self, api_key: str, base_url: str = "https://gateway.synapse.dev/v1", timeout: int = 10):
        if not api_key:
            raise ValueError("API Key is required to instantiate SynapseClient")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def request(self, path: str, method: str = "GET", headers: Optional[Dict[str, str]] = None, body: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        url = f"{self.base_url}/{path.lstrip('/')}"
        req_headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "synapse-sdk-python/1.0.0"
        }
        if headers:
            req_headers.update(headers)

        return {
            "status": 200,
            "data": {
                "message": "Processed via Synapse Python SDK",
                "path": path,
                "timestamp": time.time()
            }
        }

    @staticmethod
    def verify_webhook_signature(payload: str, signature_header: str, secret_key: str, tolerance: int = 300) -> bool:
        try:
            parts = signature_header.split(",")
            t_val = 0
            v1_val = ""
            for part in parts:
                k, v = part.split("=")
                if k == "t":
                    t_val = int(v)
                elif k == "v1":
                    v1_val = v
            
            if not t_val or not v1_val:
                return False
                
            if abs(time.time() - t_val) > tolerance:
                return False
                
            expected = hmac.new(secret_key.encode("utf-8"), f"t={t_val},v1={payload}".encode("utf-8"), hashlib.sha256).hexdigest()
            return hmac.compare_digest(v1_val, expected)
        except Exception:
            return False
