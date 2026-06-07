from transformers import pipeline

pipe = pipeline("text-generation", model="Qwen/Qwen3-8B")
messages = [
    {"role": "user", "content": "Who are you?"},
]
response = pipe(messages[0]["content"], max_length=100, do_sample=True, temperature=0.7)
print(response)