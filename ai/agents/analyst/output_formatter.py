from schemas import RegulationAnalysis

def build_analysis(
    title,
    summary,
    obligations,
    deadlines,
    impact,
    risk
):

    return RegulationAnalysis(
        title=title,
        summary=summary,
        obligations=obligations,
        deadlines=deadlines,
        affected_departments=impact["departments"],
        affected_systems=impact["systems"],
        risk_level=risk
    )