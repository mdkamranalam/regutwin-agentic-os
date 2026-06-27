from transformers import pipeline
from typer import prompt

def ask_llm(prompt: str):
    pipe = pipeline("text-generation", model="Qwen/Qwen3-8B")

    response = pipe(prompt, max_length=100, do_sample=True, temperature=0.7)

    return response[0]['generated_text']
