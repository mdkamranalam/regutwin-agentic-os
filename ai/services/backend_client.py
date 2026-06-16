import requests

class BackendClient:

    BASE_URL = ("http://localhost:8000")

    @staticmethod
    def save_analysis(regulation_id: str, analysis: dict):

        response = requests.post(f"{BackendClient.BASE_URL}/api/v1/internal/analysis",
            json={
                "regulationId": regulation_id,
                "analysis": analysis
            }
        )

        return response.json()