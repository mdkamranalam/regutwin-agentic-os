from obligation_extractor import extract_obligations
from deadline_extractor import extract_deadlines
from impact_analyzer import analyze_impact
from risk_analyzer import calculate_risk
from regulation_summarizer import summarize
from output_formatter import build_analysis

def analyze_regulation(text):

    obligations = extract_obligations(text)

    deadlines = extract_deadlines(text)

    impact = analyze_impact(text)

    risk = calculate_risk(obligations)

    summary = summarize(text)

    return build_analysis(
        title="Generated Title",
        summary=summary,
        obligations=obligations,
        deadlines=deadlines,
        impact=impact,
        risk=risk
    )