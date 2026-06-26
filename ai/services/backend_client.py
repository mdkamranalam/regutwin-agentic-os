import requests

import os

class BackendClient:

    BASE_URL = os.getenv("BACKEND_URL", "http://localhost:8000/api/v1").replace("/api/v1", "")

    @staticmethod
    def save_analysis(regulation_id: str, analysis: dict):

        response = requests.post(f"{BackendClient.BASE_URL}/api/v1/internal/analysis",
            headers={"X-Internal-Secret": "regutwin_secret_key"},
            json={
                "regulationId": regulation_id,
                "analysis": analysis
            }
        )

        return response.json()