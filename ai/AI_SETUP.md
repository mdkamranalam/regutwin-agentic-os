# AI_SETUP.md

# Setting Up the ReguTwin AI Layer

## Introduction

Before building agents, workflows, vector databases, or regulatory intelligence systems, we need a solid development environment. Many developers rush into AI development without understanding the purpose of the tools they install. As a result, they can run commands successfully but have no idea how the components fit together.

This document is designed to prevent that problem.

The goal is not only to help you install the required software, but also to explain why each tool exists, what role it plays in the architecture, and how it contributes to the overall vision of ReguTwin.

When you finish this setup guide, you should understand not only how to run the system but also why the system is designed this way.

---

# Understanding the AI Technology Stack

Before installing anything, let's understand what we are actually building.

The ReguTwin AI Layer consists of five major components:

1. AI Models
2. Agent Framework
3. Knowledge System
4. Workflow Engine
5. API Layer

Each component solves a different problem.

Think of the entire AI system as a company.

The AI model acts like the employee's brain.

The workflow engine acts like management.

The vector database acts like organizational memory.

The API layer acts like communication channels.

The agents act like employees with specialized responsibilities.

Understanding these relationships will make the rest of the project significantly easier.

---

# Why We Use Python

The AI layer is built entirely in Python.

Many developers ask why we don't build AI services directly in Node.js since the backend already uses JavaScript.

The answer is simple.

Python has become the industry standard for artificial intelligence and machine learning.

Most AI libraries are designed for Python first.

Examples include:

* LangGraph
* LangChain
* Transformers
* Sentence Transformers
* ChromaDB
* PyTorch
* Hugging Face

Although JavaScript versions exist for some of these tools, the Python ecosystem is significantly more mature.

For this reason, the frontend and backend remain in JavaScript/TypeScript, while the AI layer is implemented in Python.

This separation of responsibilities is common in production AI systems.

---

# Step 1: Install Python

ReguTwin requires Python 3.12 or newer.

Verify installation:

```bash
python --version
```

Expected output:

```bash
Python 3.12.x
```

If Python is not installed, download it from:

https://www.python.org/downloads/

During installation, make sure "Add Python to PATH" is enabled.

Without this option, terminal commands may fail later.

---

# Understanding Virtual Environments

One of the most important Python concepts is the virtual environment.

Imagine two projects:

Project A uses:

```text
LangChain 0.1
```

Project B uses:

```text
LangChain 0.3
```

If both projects share the same Python environment, dependency conflicts occur.

Virtual environments solve this problem by creating isolated Python installations for each project.

Think of a virtual environment as a private workspace dedicated to ReguTwin.

Every package installed inside that environment belongs only to this project.

---

# Step 2: Create a Virtual Environment

Navigate to the AI folder:

```bash
cd ai
```

Create environment:

```bash
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Mac/Linux:

```bash
source venv/bin/activate
```

When activated, the terminal usually displays:

```bash
(venv)
```

This indicates that all future package installations belong only to ReguTwin.

---

# Understanding Ollama

Most AI tutorials rely on OpenAI APIs.

Whenever a request is sent, the model runs on OpenAI servers.

While convenient, this introduces several challenges:

* API costs
* Rate limits
* Internet dependency
* Privacy concerns
* Vendor lock-in

For ReguTwin, we want local intelligence.

This means the model should run on our own machine.

Ollama provides this capability.

Think of Ollama as Docker for AI models.

It downloads models, manages them, and provides a local API for interacting with them.

Instead of sending requests to OpenAI, we send requests to Ollama running on our machine.

---

# Step 3: Install Ollama

Download:

https://ollama.com

Verify installation:

```bash
ollama --version
```

If the version appears successfully, Ollama is ready.

---

# Understanding AI Models

Many beginners think Ollama is the AI model.

It is not.

Ollama is the model manager.

The actual intelligence comes from models such as:

* Qwen
* Llama
* Mistral
* DeepSeek

Ollama simply runs them.

Think of Ollama as a media player.

Think of the AI model as the movie.

---

# Why We Use Qwen

For ReguTwin, we need strong reasoning capabilities.

The model must:

* Read regulations
* Extract obligations
* Identify deadlines
* Generate structured outputs
* Perform compliance reasoning

Qwen performs exceptionally well in these tasks.

It also works effectively on consumer hardware.

---

# Step 4: Download Qwen

Install model:

```bash
ollama pull qwen3:8b
```

This may take several minutes depending on internet speed.

Verify installation:

```bash
ollama list
```

Expected:

```bash
qwen3:8b
```

---

# Understanding Embeddings

Before learning ChromaDB, you must understand embeddings.

Computers do not understand language.

They understand numbers.

To perform semantic search, text must be converted into numerical representations.

Example:

```text
Enable MFA
```

becomes:

```text
[0.234, 0.912, 0.331, ...]
```

This numerical representation is called an embedding.

Embeddings allow machines to compare meanings rather than exact words.

This concept powers:

* Semantic Search
* RAG
* Conflict Detection
* Similarity Search

Without embeddings, our knowledge system cannot function.

---

# Understanding ChromaDB

A traditional database stores records.

Example:

```sql
SELECT * FROM regulations
```

ChromaDB stores embeddings.

This allows us to search for meaning.

Suppose a regulation says:

```text
Enable Multi-Factor Authentication
```

Another says:

```text
Require Two-Factor Authentication
```

Keyword search may fail.

Semantic search succeeds because both concepts have similar embeddings.

For ReguTwin, ChromaDB becomes the memory of the AI layer.

---

# Step 5: Install ChromaDB

```bash
pip install chromadb
```

Purpose:

* Store regulation embeddings
* Store compliance memory
* Support conflict detection
* Enable semantic retrieval

---

# Understanding LangGraph

As the project grows, we will have multiple agents.

Without orchestration:

```text
Watchman
calls Analyst

Analyst
calls Mapper

Mapper
calls Validator
```

This becomes difficult to maintain.

LangGraph solves this problem.

It treats agents as nodes within a workflow.

Information flows through these nodes in a structured manner.

Think of LangGraph as the operating system of the AI layer.

Without LangGraph, agents are isolated.

With LangGraph, agents become a coordinated workforce.

---

# Step 6: Install LangGraph

```bash
pip install langgraph
```

This framework will be used later when building agent workflows.

Do not attempt to learn LangGraph immediately.

First learn how individual agents work.

Then learn orchestration.

---

# Understanding FastAPI

The AI layer must communicate with the backend.

The backend cannot directly access Python functions.

Instead, the AI layer exposes APIs.

FastAPI provides these APIs.

Example:

Backend sends:

```http
POST /analyze-regulation
```

AI Layer receives request.

Analyst Agent processes regulation.

AI Layer returns response.

This separation keeps the architecture clean and scalable.

---

# Step 7: Install FastAPI

```bash
pip install fastapi
pip install uvicorn
```

FastAPI becomes the gateway between:

Backend
↔
AI Layer

---

# Install Remaining Dependencies

```bash
pip install pydantic
pip install requests
pip install beautifulsoup4
pip install pypdf
pip install sentence-transformers
pip install langchain
pip install langchain-community
pip install langchain-ollama
```

Each package exists for a specific reason.

requests:
Used for HTTP communication.

BeautifulSoup:
Used for web scraping.

PyPDF:
Used for PDF text extraction.

Sentence Transformers:
Used for embeddings.

Pydantic:
Used for structured outputs and validation.

LangChain:
Provides AI utilities.

LangChain Ollama:
Connects LangChain to local models.

---

# Testing the Environment

Create:

```python
test_model.py
```

Content:

```python
from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="qwen3:8b"
)

response = llm.invoke(
    "What is Multi-Factor Authentication?"
)

print(response.content)
```

Run:

```bash
python test_model.py
```

If a response appears, your local AI environment is working.

This is the first milestone of the entire AI project.

---

# Understanding What Happens Next

At this point, we have not built any agents.

We have only prepared the environment.

Many beginners confuse installation with development.

Installation simply prepares the tools.

The actual project begins afterward.

The next major milestone is building the Analyst Agent.

The Analyst Agent will become the first true intelligence component in ReguTwin.

Its responsibility will be converting regulatory text into structured compliance obligations.

Once the Analyst Agent works successfully, the rest of the system can begin to grow around it.

---

# Final Checklist

Before proceeding:

✓ Python Installed

✓ Virtual Environment Created

✓ Ollama Installed

✓ Qwen Downloaded

✓ ChromaDB Installed

✓ LangGraph Installed

✓ FastAPI Installed

✓ Test Model Running

If every item above is complete, your AI development environment is ready and you can begin building the first agent in the ReguTwin intelligence pipeline.
