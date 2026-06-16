from services.analyst_service import (AnalystService)
from services.backend_client import (BackendClient)


def run_regulation_flow(regulation_id: str, text: str):
    analysis = (AnalystService.process(text))
    BackendClient.save_analysis(regulation_id, analysis)

    return analysis