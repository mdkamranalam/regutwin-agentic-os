from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Obligation(BaseModel):
    description: str
    deadline: Optional[str] = None

class AnalysisResult(BaseModel):
    obligations: List[Obligation]
    deadlines: List[str]
    affectedSystems: List[str]
    policyChanges: List[str]
    riskLevel: RiskLevel