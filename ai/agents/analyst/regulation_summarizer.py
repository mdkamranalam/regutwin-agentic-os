from llm.qwen_client import ask_llm

def summarize(text):

    prompt = f"""
    Summarize this regulation.

    Maximum 100 words.

    {text}
    """

    return ask_llm(prompt)