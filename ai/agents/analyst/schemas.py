from pydantic import BaseModel
from typing import List

class Deadline(BaseModel):
    description: str
    date: str

class RegulationAnalysis(BaseModel):
    title: str
    summary: str

    obligations: List[str]

    deadlines: List[Deadline]

    affected_departments: List[str]

    affected_systems: List[str]

    risk_level: str