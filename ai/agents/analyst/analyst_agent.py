import json
from json_repair import repair_json
from llm.ollama_client import OllamaClient
from .prompts import ANALYST_PROMPT

class AnalystAgent:

    @staticmethod
    def analyze(text: str):

        prompt = f"""
        {ANALYST_PROMPT}

        Regulation:
        {text}
        """

        response = OllamaClient.analyze(prompt)

        print("RAW LLM RESPONSE:")
        print(response)
        
        fixed = repair_json(response)
        
        print("REPAIRED JSON:")
        print(fixed)
        
        return json.loads(fixed)