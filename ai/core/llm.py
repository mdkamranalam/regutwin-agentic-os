import os
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import requests
import json

load_dotenv()

class LLMConfig(BaseModel):
    model: str = os.getenv("OLLAMA_MODEL", "qwen2.5:9b")
    base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    temperature: float = 0.1
    timeout: int = 60

config = LLMConfig()

def ask_llm(prompt: str, system_prompt: str = "You are a helpful assistant.", structured_output: Optional[type] = None) -> any:
    """
    Generic function to communicate with Ollama.
    Supports both raw text and structured Pydantic output.
    """
    url = f"{config.base_url}/api/generate"

    # Prepare the payload
    # Ollama's /api/generate is basic. For chat-like behavior with system prompts,
    # we combine them or use /api/chat. Let's use /api/chat for better control.
    chat_url = f"{config.base_url}/api/chat"

    payload = {
        "model": config.model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "stream": False,
        "options": {
            "temperature": config.temperature
        }
    }

    # If structured output is requested, we explicitly tell the model to return JSON
    if structured_output:
        # Add format: 'json' to the request for Ollama's native JSON mode
        payload["format"] = "json"
        system_prompt += f"\n\nIMPORTANT: You must return your response as a valid JSON object matching this schema: {structured_output.model_json_schema()}"

    try:
        response = requests.post(chat_url, json=payload, timeout=config.timeout)
        response.raise_for_status()

        result = response.json()
        content = result['message']['content']

        if structured_output:
            return structured_output.model_validate_json(content)

        return content

    except Exception as e:
        print(f"Error communicating with Ollama: {e}")
        raise e
