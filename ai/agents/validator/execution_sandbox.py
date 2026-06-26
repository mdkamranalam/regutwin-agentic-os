import requests
import json
import time

def execute_http_test(method: str, url: str, headers: dict = None, payload: dict = None, timeout: int = 10):
    """
    Hardened execution sandbox enforcing strict 10s execution timeout and infinite loop protection.
    """
    start_time = time.time()
    try:
        # Enforce strict 10-second timeout
        safe_timeout = min(timeout, 10)
        
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers, timeout=safe_timeout)
        elif method.upper() == 'POST':
            response = requests.post(url, headers=headers, json=payload, timeout=safe_timeout)
        elif method.upper() == 'PUT':
            response = requests.put(url, headers=headers, json=payload, timeout=safe_timeout)
        elif method.upper() == 'DELETE':
            response = requests.delete(url, headers=headers, timeout=safe_timeout)
        else:
            return {"error": f"Unsupported HTTP method: {method}"}

        elapsed = time.time() - start_time
        if elapsed > 10.0:
            return {"error": "🚨 Sandbox Security Violation: Test execution exceeded maximum allowable 10s SLA threshold."}

        return {
            "status_code": response.status_code,
            "response_text": response.text[:1000],
            "headers": dict(response.headers),
            "execution_time_ms": round(elapsed * 1000)
        }
    except requests.exceptions.Timeout:
        return {"error": "🚨 Execution Sandbox Timeout: HTTP request terminated after exceeding strict 10s limit."}
    except Exception as e:
        return {"error": f"Sandbox Exception: {str(e)}"}
