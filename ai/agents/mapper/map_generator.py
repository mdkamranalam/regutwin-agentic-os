from core.llm import ask_llm
from schemas.analysis import RegulationAnalysis
from schemas.map import MAPList


def generate_maps(analysis: RegulationAnalysis) -> MAPList:
    """
    Converts extracted regulatory obligations into fully Measurable Action Points (MAPs).
    Each MAP includes acceptance criteria, validation method, success threshold, and evidence required.
    """
    system_prompt = (
        "You are an expert Compliance Project Manager and Regulatory Implementation Specialist. "
        "Your task is to convert regulatory obligations into highly specific, auditable Measurable Action Points (MAPs). "
        "Each MAP must be MEASURABLE — it must contain:\n"
        "  1. A specific action required (verb-driven, unambiguous)\n"
        "  2. A testable acceptance criterion (pass/fail condition)\n"
        "  3. A validation method (API_TEST, EVIDENCE_REVIEW, POLICY_CHECK, CONFIGURATION_CHECK, or MANUAL_REVIEW)\n"
        "  4. A measurable success threshold (e.g., '100% pass rate', 'All 5 documents present')\n"
        "  5. Specific evidence required to close the MAP\n"
        "  6. A realistic priority (Critical/High/Medium/Low) based on regulatory urgency\n"
        "  7. A risk level if not completed (Critical/High/Medium/Low)\n\n"
        "Be specific and technical. Vague MAPs like 'Review requirements' are NOT acceptable. "
        "Every MAP must be testable and auditable."
    )

    obligations_text = "\n".join(
        f"  - [{ob.priority}] {ob.requirement} (Category: {ob.category})"
        for ob in analysis.obligations
    )

    deadlines_text = "\n".join(
        f"  - {dl.description}: {dl.date}"
        for dl in analysis.deadlines
    ) if analysis.deadlines else "  - No specific deadlines mentioned."

    prompt = (
        f"REGULATION TITLE: {analysis.title}\n"
        f"SUMMARY: {analysis.summary}\n"
        f"RISK LEVEL: {analysis.risk_level}\n\n"
        f"EXTRACTED OBLIGATIONS:\n{obligations_text}\n\n"
        f"DEADLINES:\n{deadlines_text}\n\n"
        f"AFFECTED DEPARTMENTS: {', '.join(analysis.affected_departments or [])}\n"
        f"AFFECTED SYSTEMS: {', '.join(analysis.affected_systems or [])}\n\n"
        "Generate a comprehensive list of Measurable Action Points (MAPs) from the above obligations. "
        "Each MAP must be atomic, specific, and independently testable. "
        "For technical obligations, prefer API_TEST or CONFIGURATION_CHECK as the validation method. "
        "For policy obligations, use EVIDENCE_REVIEW or POLICY_CHECK. "
        "For process obligations, use MANUAL_REVIEW. "
        "Set priority = Critical for obligations that carry immediate compliance risk. "
        "Acceptance criteria must be a specific, verifiable statement — not a vague description."
    )

    return ask_llm(
        prompt=prompt,
        system_prompt=system_prompt,
        structured_output=MAPList,
    )
