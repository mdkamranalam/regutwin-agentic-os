from llm.qwen_client import ask_llm

def analyze_impact(text: str):

    prompt = f"""
    Identify:

    - Departments
    - Systems
    - Applications

    Return JSON.

    {text}
    """

    return ask_llm(prompt)