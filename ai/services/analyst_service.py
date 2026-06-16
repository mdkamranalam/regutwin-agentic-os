from agents.analyst.schemas import (AnalysisResult)

VALID_RISKS = {
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL"
}

class AnalystService:

    @staticmethod
    def process(text: str):

        result = AnalystAgent.analyze(text)

        risk = str(
            result.get(
                "riskLevel",
                "MEDIUM"
            )).upper()

        if risk not in VALID_RISKS:
            risk = "MEDIUM"

        result["riskLevel"] = risk

        validated = AnalysisResult(**result)

        return validated.model_dump()