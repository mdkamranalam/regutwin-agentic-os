from agents.analyst.obligation_extractor import (
    extract_obligations
)

sample_text = """
Banks must implement MFA.
Banks must encrypt customer data.
"""

result = extract_obligations(sample_text)

print(result)