from pydantic import BaseModel, Field
from typing import List, Optional

class Deadline(BaseModel):
    description: str = Field(..., description="Description of the deadline or time-bound requirement")
    date: str = Field(..., description="The specific date or relative timeframe (e.g., 'Within 30 days of event X')")

class Obligation(BaseModel):
    requirement: str = Field(..., description="The specific regulatory requirement or 'shall' statement")
    priority: str = Field(..., description="Priority level: High, Medium, or Low")
    category: str = Field(..., description="The area of regulation this belongs to (e.g., Legal, Technical, Operational)")

class RegulationAnalysis(BaseModel):
    title: str = Field(..., description="A concise title for the regulation")
    summary: str = Field(..., description="A high-level summary of the regulation's purpose")
    obligations: List[Obligation] = Field(..., description="List of extracted legal obligations")
    deadlines: List[Deadline] = Field(..., description="List of extracted deadlines")
    affected_departments: List[str] = Field(..., description="Departments affected by this regulation (e.g., HR, IT, Legal)")
    affected_systems: List[str] = Field(..., description="IT systems affected by this regulation")
    risk_level: str = Field(..., description="Overall risk level: Critical, High, Medium, or Low")
