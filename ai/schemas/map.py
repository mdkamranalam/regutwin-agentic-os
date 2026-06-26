from pydantic import BaseModel, Field
from typing import List, Optional

class MAPItem(BaseModel):
    action_required: str = Field(..., description="The specific action needed to comply with the obligation.")
    description: str = Field(..., description="A clear description of the tasks required.")
    deadline: Optional[str] = Field(None, description="Target completion deadline date string (e.g. 2026-07-01)")

class MAPList(BaseModel):
    maps: List[MAPItem] = Field(..., description="List of Measurable Action Points (MAPs)")

class AssignedMAP(BaseModel):
    action_required: str = Field(...)
    description: str = Field(...)
    assignedTo: str = Field(..., description="The department assigned to this task (e.g., IT Security, Risk, Legal, Compliance, Finance)")
    deadline: Optional[str] = Field(None, description="Target completion deadline date string")

class AssignedMAPList(BaseModel):
    maps: List[AssignedMAP] = Field(...)
