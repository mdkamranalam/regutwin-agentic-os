from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="qwen3:8b"
)

response = llm.invoke(
    "What is Multi-Factor Authentication?"
)

print(response.content) 