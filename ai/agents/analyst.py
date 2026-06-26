from core.llm import ask_llm
from schemas.analysis import RegulationAnalysis, Obligation, Deadline
from vector_db.chroma_client import store_obligations
from services.compliance_memory import get_historical_context, store_analysis_history

def analyze_regulation(text: str, regulation_id: str = "unknown", title: str = "Unknown", source: str = "Unknown") -> RegulationAnalysis:
    """
    Agentic wrapper that analyzes regulations using LLM structured extraction + longitudinal memory.
    """
    system_prompt = (
        "You are an expert Regulatory Compliance Analyst. Your task is to analyze "
        "legal documents and extract structured data. You must be precise, "
        "objective, and ensure no critical obligations are missed. Leverage historical compliance velocity context."
    )

    # Fetch longitudinal historical memory context
    historical_context = get_historical_context(title if title != "Unknown" else text[:100])

    prompt = (
        f"Analyze the following regulatory text and extract all obligations, deadlines, and impacts.\n\n"
        f"{historical_context}\n\n"
        f"Regulatory Text:\n{text}"
    )

    analysis_result = ask_llm(
        prompt=prompt,
        system_prompt=system_prompt,
        structured_output=RegulationAnalysis
    )

    if analysis_result and analysis_result.obligations and regulation_id != "unknown":
        resolved_title = title if title != "Unknown" else analysis_result.title
        store_obligations(
            regulation_id=regulation_id,
            title=resolved_title,
            source=source,
            obligations=analysis_result.obligations
        )
        # Record into longitudinal compliance history (Phase 13)
        store_analysis_history(
            regulation_id=regulation_id,
            title=resolved_title,
            summary=analysis_result.summary,
            obligations_count=len(analysis_result.obligations)
        )

    return analysis_result
