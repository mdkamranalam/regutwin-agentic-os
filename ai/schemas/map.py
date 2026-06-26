from pydantic import BaseModel, Field
from typing import List, Optional


class MAPItem(BaseModel):
    action_required: str = Field(..., description="The specific action needed to comply with the obligation.")
    description: str = Field(..., description="A clear description of the tasks required.")
    priority: str = Field(..., description="Priority level: Critical, High, Medium, or Low")
    risk_level: str = Field(..., description="Risk level if not completed: Critical, High, Medium, or Low")
    deadline: Optional[str] = Field(None, description="Target completion deadline date string (e.g. 2026-07-01 or 'Within 30 days')")
    acceptance_criteria: str = Field(
        ...,
        description=(
            "Specific, testable, measurable condition that must be true for this MAP to be considered complete. "
            "Example: 'System session timeout must be configured to exactly 30 seconds and verified by testing 3 consecutive login sessions.'"
        ),
    )
    validation_method: str = Field(
        ...,
        description=(
            "How completion will be validated. "
            "Choose one: API_TEST (live HTTP endpoint test), "
            "EVIDENCE_REVIEW (document/screenshot review by LLM), "
            "POLICY_CHECK (policy document analysis), "
            "CONFIGURATION_CHECK (config file verification), "
            "MANUAL_REVIEW (human audit required)"
        ),
    )
    success_threshold: str = Field(
        ...,
        description=(
            "Measurable success threshold. "
            "Example: '100% of session timeout tests must pass', "
            "'All 5 KYC documents must be present', "
            "'Error rate < 0.1%'"
        ),
    )
    evidence_required: str = Field(
        ...,
        description=(
            "Specific evidence that must be submitted to close this MAP. "
            "Example: 'API response logs showing 401 after 30s', "
            "'Screenshots of timeout settings', "
            "'Signed policy document PDF'"
        ),
    )


class MAPList(BaseModel):
    maps: List[MAPItem] = Field(..., description="List of Measurable Action Points (MAPs)")


class AssignedMAP(BaseModel):
    action_required: str = Field(...)
    description: str = Field(...)
    assignedTo: str = Field(
        ...,
        description="The department assigned to this task (e.g., IT Security, Risk, Legal, Compliance, Finance)"
    )
    priority: str = Field(..., description="Priority: Critical, High, Medium, Low")
    risk_level: str = Field(..., description="Risk level: Critical, High, Medium, Low")
    deadline: Optional[str] = Field(None)
    acceptance_criteria: str = Field(...)
    validation_method: str = Field(...)
    success_threshold: str = Field(...)
    evidence_required: str = Field(...)


class AssignedMAPList(BaseModel):
    maps: List[AssignedMAP] = Field(...)
