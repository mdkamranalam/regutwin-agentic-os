import pytest
from core.llm import ask_llm
from schemas.analysis import RegulationAnalysis
from agents.analyst import analyze_regulation

def test_llm_connection():
    """Test if Ollama is reachable and responding."""
    try:
        response = ask_llm("Hello, are you working?", system_prompt="You are a helpful assistant.")
        assert isinstance(response, str)
        assert len(response) > 0
    except Exception as e:
        pytest.fail(f"LLM Connection failed: {e}")

def test_structured_output():
    """Test if the LLM can return a valid RegulationAnalysis object."""
    sample_text = "The company shall implement a data backup policy within 30 days. IT department is responsible. Risk is Medium."

    try:
        result = analyze_regulation(sample_text)
        assert isinstance(result, RegulationAnalysis)
        assert result.title is not None
        assert len(result.obligations) > 0
        assert any("backup" in obj.requirement.lower() for obj in result.obligations)
    except Exception as e:
        pytest.fail(f"Structured output failed: {e}")

def test_invalid_text_handling():
    """Test how the system handles gibberish or non-regulatory text."""
    sample_text = "I like ice cream and sunny days."

    try:
        result = analyze_regulation(sample_text)
        assert isinstance(result, RegulationAnalysis)
        # It should still return the schema, but likely with empty lists
    except Exception as e:
        pytest.fail(f"Invalid text handling failed: {e}")
