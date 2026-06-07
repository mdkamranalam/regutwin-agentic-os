HIGH_RISK_KEYWORDS = [
    "kyc",
    "aml",
    "fraud",
    "cybersecurity",
    "authentication"
]

def calculate_risk(obligations):

    for obligation in obligations:

        lower = obligation.lower()

        for keyword in HIGH_RISK_KEYWORDS:

            if keyword in lower:
                return "HIGH"

    return "MEDIUM"