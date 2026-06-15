# AI Layer Implementation Plan - ReguTwin Agentic OS

## 1. Project Overview & Concept
ReguTwin is designed to be an "Agentic OS" for regulatory compliance. Instead of just summarizing PDFs, it aims to:
- **Ingest**: Process complex regulatory documents (PDFs).
- **Analyze**: Extract obligations, deadlines, and risks.
- **Map**: Link these obligations to specific corporate departments and systems.
- **Monitor**: Track compliance status and alert on upcoming deadlines.
- **Reason**: Use an agentic workflow to detect conflicts between different regulations.

### Current State
- **Backend**: Node.js/TypeScript handling PDF uploads and basic storage.
- **AI Layer**: A FastAPI bridge that executes a linear pipeline of analysis functions using a local Qwen model.
- **Frontend**: (Pending full analysis) Likely provides the interface for uploading and reviewing analysis.

---

## 2. Conceptual Architecture
We will move from a **Linear Pipeline** $\rightarrow$ **Agentic Graph**.

### Linear (Current)
`Text` $\rightarrow$ `Summarizer` $\rightarrow$ `Obligation Extractor` $\rightarrow$ `Deadline Extractor` $\rightarrow$ `Risk Analyzer` $\rightarrow$ `Result`

### Agentic (Target)
`Input` $\rightarrow$ **Supervisor Agent** $\rightarrow$ { **Specialist Agents** (RAG Agent, Legal Analyst, Risk Officer) } $\rightarrow$ **Verifier Agent** $\rightarrow$ `Structured Output`

---

## 3. Implementation Roadmap

### Phase 1: LLM Core & Structured Output
**Goal**: Move from raw text generation to guaranteed JSON schemas.
- **Task 1.1**: Replace `qwen_client.py` with a flexible LLM provider (e.g., Claude API, OpenAI, or vLLM).
- **Task 1.2**: Implement **Instructor** or **Pydantic** for strict output validation.
- **Task 1.3**: Create a prompt registry to manage system prompts for different agents.

### Phase 2: RAG (Retrieval Augmented Generation)
**Goal**: Allow the AI to "remember" and "query" across multiple regulations.
- **Task 2.1**: Integrate **ChromaDB** (as referenced in project docs).
- **Task 2.2**: Implement a PDF processing pipeline: `PDF` $\rightarrow$ `Chunking` $\rightarrow$ `Embedding` $\rightarrow$ `Vector Store`.
- **Task 2.3**: Create a `RetrievalAgent` that can fetch relevant sections of a regulation before analysis.

### Phase 3: Agentic Orchestration with LangGraph
**Goal**: Implement a stateful graph to handle complex reasoning.
- **Task 3.1**: Setup **LangGraph** to manage the state of a "Regulation Analysis Session".
- **Task 3.2**: Build the **Supervisor Node**: Decides which specialist to call based on the document content.
- **Task 3.3**: Build **Specialist Nodes**:
    - `ObligationAgent`: Focuses on "Shall", "Must", "Required".
    - `DeadlineAgent`: Extracts dates and creates timelines.
    - `ImpactAgent`: Maps obligations to `affected_departments` and `affected_systems`.
- **Task 3.4**: Implement a **Review Cycle**: If the `VerifierAgent` finds gaps, it sends the task back to the specialist.

### Phase 4: Backend Integration (The "OS" part)
**Goal**: Make the AI "act" on the system.
- **Task 4.1**: Create **Tools** for agents to call Backend APIs (e.g., `create_obligation_in_db`, `update_regulation_status`).
- **Task 4.2**: Implement a webhook system where the Backend triggers the AI Bridge upon PDF upload.

---

## 4. Proposed Code Structure (AI Folder)

```text
ai/
├── main.py                 # FastAPI entry point
├── core/
│   ├── llm.py              # LLM Client (Claude/OpenAI/etc)
│   ├── prompts.py          # System prompts for all agents
│   └── config.py           # Environment variables
├── agents/
│   ├── graph.py            # LangGraph definition (The "Brain")
│   ├── state.py            # Graph state definition
│   └── nodes/              # Individual agent logic
│       ├── supervisor.py
│       ├── obligation_ext.py
│       ├── deadline_ext.py
│       └── impact_analyst.py
├── tools/
│   ├── vector_store.py     # ChromaDB integration
│   └── backend_api.py      # Tools to communicate with Node.js backend
└── schemas/
    └── analysis.py         # Pydantic models for structured output
```

## 5. Example: The "Obligation Agent" Logic (Conceptual)

```python
# ai/agents/nodes/obligation_ext.py
from schemas.analysis import Obligation
from core.llm import ask_structured_llm

def obligation_node(state):
    # 1. Retrieve relevant chunks from RAG
    context = state["context"]
    
    # 2. Call LLM with a specific "Legal Extraction" prompt
    prompt = f"Extract all legal obligations from the following text: {context}"
    obligations = ask_structured_llm(prompt, response_model=List[Obligation])
    
    # 3. Update graph state
    return {"obligations": obligations}
```
