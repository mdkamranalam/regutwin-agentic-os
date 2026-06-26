from core.llm import ask_llm
from schemas.map import MAPList, AssignedMAPList


def assign_departments(map_list: MAPList) -> AssignedMAPList:
    """
    Assigns each MAP to the most appropriate department and preserves all measurable fields.
    Departments: IT Security, Risk, Legal, Compliance, Finance.
    """
    system_prompt = (
        "You are an expert Compliance Router and Regulatory Assignee Specialist. "
        "Your task is to review a list of Measurable Action Points (MAPs) and assign each one "
        "to the MOST appropriate department. You MUST choose ONLY from: "
        "'IT Security', 'Risk', 'Legal', 'Compliance', 'Finance'.\n\n"
        "Assignment guidelines:\n"
        "  - IT Security: Session timeouts, encryption, access controls, system hardening, API security\n"
        "  - Risk: Risk assessment, risk scoring, capital adequacy, stress testing\n"
        "  - Legal: Policy documents, regulatory filings, legal opinions, contract reviews\n"
        "  - Compliance: Process compliance, training, reporting to regulators, monitoring\n"
        "  - Finance: Capital requirements, financial reporting, fee structures, provisions\n\n"
        "Preserve ALL fields exactly as provided — especially acceptance_criteria, "
        "validation_method, success_threshold, and evidence_required. Do not modify or shorten them."
    )

    maps_text = ""
    for i, m in enumerate(map_list.maps, 1):
        maps_text += (
            f"MAP {i}:\n"
            f"  Action: {m.action_required}\n"
            f"  Description: {m.description}\n"
            f"  Priority: {m.priority}\n"
            f"  Risk Level: {m.risk_level}\n"
            f"  Deadline: {m.deadline or 'Not specified'}\n"
            f"  Acceptance Criteria: {m.acceptance_criteria}\n"
            f"  Validation Method: {m.validation_method}\n"
            f"  Success Threshold: {m.success_threshold}\n"
            f"  Evidence Required: {m.evidence_required}\n\n"
        )

    prompt = (
        f"Assign each of the following MAPs to the correct department. "
        f"Preserve all measurable fields exactly as provided.\n\n{maps_text}"
    )

    return ask_llm(
        prompt=prompt,
        system_prompt=system_prompt,
        structured_output=AssignedMAPList,
    )
