from llm.qwen_client import ask_llm

def extract_obligations(text: str):

    prompt = f"""
    Extract all compliance obligations.

    Return JSON array only.

    Regulation:

    {text}
    """

    return ask_llm(prompt)