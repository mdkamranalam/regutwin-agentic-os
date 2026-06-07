from llm.qwen_client import ask_llm

def extract_deadlines(text: str):

    prompt = f"""
    Extract all compliance deadlines.

    Return JSON only.

    Regulation:

    {text}
    """

    return ask_llm(prompt)