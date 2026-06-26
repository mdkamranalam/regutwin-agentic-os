"""
ReguTwin LLM Core — Multi-Provider Support
==========================================
Supports Gemini, OpenAI, and Ollama via LLM_PROVIDER env var.
Priority: gemini → openai → ollama (default)

Set LLM_PROVIDER=gemini and GEMINI_API_KEY=<key> for cloud demo.
Set LLM_PROVIDER=openai and OPENAI_API_KEY=<key> for OpenAI.
Default is LLM_PROVIDER=ollama (requires local Ollama installation).
"""

import os
from typing import Optional, Type
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "ollama").lower()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


def _get_llm():
    """Return the appropriate LangChain LLM instance based on LLM_PROVIDER."""
    provider = LLM_PROVIDER

    # Auto-detect provider from available keys
    if provider == "auto":
        if GEMINI_API_KEY:
            provider = "gemini"
        elif OPENAI_API_KEY:
            provider = "openai"
        else:
            provider = "ollama"

    if provider == "gemini":
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(
                model=GEMINI_MODEL,
                google_api_key=GEMINI_API_KEY,
                temperature=0.1,
                convert_system_message_to_human=True,
            )
        except ImportError:
            print("[LLM] langchain_google_genai not installed. Falling back to Ollama.")
            provider = "ollama"

    if provider == "openai":
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(
                model=OPENAI_MODEL,
                api_key=OPENAI_API_KEY,
                temperature=0.1,
            )
        except ImportError:
            print("[LLM] langchain_openai not installed. Falling back to Ollama.")
            provider = "ollama"

    # Default: Ollama
    from langchain_ollama import ChatOllama
    return ChatOllama(
        model=OLLAMA_MODEL,
        base_url=OLLAMA_BASE_URL,
        temperature=0.1,
    )


def ask_llm(
    prompt: str,
    system_prompt: str = "You are a helpful assistant.",
    structured_output: Optional[Type[BaseModel]] = None,
) -> any:
    """
    Unified LLM call supporting Gemini, OpenAI, and Ollama.
    Supports both raw text and structured Pydantic output.
    """
    from langchain_core.prompts import ChatPromptTemplate

    llm = _get_llm()

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    if structured_output:
        structured_llm = llm.with_structured_output(structured_output)
        chain = prompt_template | structured_llm
        return chain.invoke({"input": prompt})
    else:
        chain = prompt_template | llm
        return chain.invoke({"input": prompt}).content
