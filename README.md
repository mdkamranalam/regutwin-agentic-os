# ReguTwin Agentic OS 🤖📜

![ReguTwin Banner](https://via.placeholder.com/1000x200.png?text=ReguTwin+Agentic+OS+-+Autonomous+Compliance)

> An Autonomous Regulatory Intelligence and Compliance Operating System designed to help banks transform manual compliance workflows into AI-driven, real-time, proof-based regulatory operations.

---

## 📖 Table of Contents
1. [The Problem](#-the-problem)
2. [The Solution](#-the-solution)
3. [Architecture Overview](#-architecture-overview)
4. [Agentic Workflow (LangGraph)](#-agentic-workflow-langgraph)
5. [Key Features](#-key-features)
6. [Tech Stack](#-tech-stack)
7. [Getting Started (Docker)](#-getting-started-docker)
8. [Running Locally (Without Docker)](#-running-locally-without-docker)
9. [Project Structure](#-project-structure)

---

## 🚨 The Problem

Financial institutions continuously receive complex regulatory updates from authorities (e.g., RBI, SEBI). Traditionally, compliance workflows rely on manual interpretation, emails, and spreadsheets, resulting in:
*   **Compliance Gaps:** Missed nuances in dense regulatory texts.
*   **Increased Audit Risks:** Lack of clear, traceable proof of compliance.
*   **Slow Implementation:** Delayed action due to inter-departmental friction.
*   **Inefficiencies:** High operational overhead for regulatory mapping.

---

## 💡 The Solution

**ReguTwin** leverages a swarm of specialized, autonomous AI agents to:
1. **Monitor** for new regulations.
2. **Extract** atomic compliance obligations and deadlines.
3. **Generate** Measurable Action Points (MAPs) and assign ownership.
4. **Detect Conflicts** across historical and concurrent regulations using Vector Search.
5. **Validate** implementation automatically using an AI Auditor.

---

## 🏛️ Architecture Overview

The system is comprised of three main interconnected services:

1. **Frontend (React + Vite)**: A stunning, real-time dashboard displaying active regulations, compliance maps, conflict warnings, and audit trails.
2. **Backend (Node + Express + MongoDB)**: The core API and state manager, persisting MAPs, regulations, and managing websocket connections.
3. **AI Layer (Python + FastAPI + LangGraph + ChromaDB)**: The brain of the operation, executing complex multi-agent workflows using local open-weights LLMs (Llama 3).

---

## 🧠 Agentic Workflow (LangGraph)

The AI layer utilizes **LangGraph** to orchestrate a deterministic, stateful graph of specialized agents:

1. **Watchman Agent**: Ingests incoming regulatory PDFs and triggers the LangGraph flow.
2. **Analyst Agent (`extract_obligations`)**: Parses dense text to extract discrete obligations, deadlines, and risk levels.
3. **Conflict Engine (`detect_conflicts_node`)**: Queries **ChromaDB** to find semantically similar historical obligations. Uses the LLM to identify active contradictions and flags them to the user.
4. **MAP Generator (`generate_maps_node`)**: Converts obligations into step-by-step Measurable Action Points (MAPs) and routes them to the correct department (IT Security, Risk, Legal, Compliance, Finance).
5. **Validator Agent**: Operates asynchronously to grade user-submitted evidence against a MAP, passing or failing the compliance action.

All transitions in the LangGraph emit real-time Socket.IO events to the frontend, allowing users to watch the AI's "thought process" live.

---

## ✨ Key Features

- **Real-time Regulatory Ingestion:** Automated text extraction from complex PDFs.
- **Semantic Conflict Detection:** Instantly flags if a new regulation contradicts an existing one.
- **Departmental Routing:** Auto-assigns compliance tasks to the correct stakeholders.
- **Live Workflow Dashboard:** Watch the AI orchestrate tasks in real-time via WebSockets.
- **Autonomous Audit Engine:** AI-graded evidence verification with comprehensive, immutable audit trails.

---

## 🛠️ Tech Stack

**Frontend:**
- React 19, Vite
- TailwindCSS v4
- React Router DOM
- Socket.io-client

**Backend:**
- Node.js, Express.js
- MongoDB & Mongoose (Cloud Atlas)
- Socket.IO
- Zod (Validation)

**AI Layer:**
- Python 3.11, FastAPI
- LangGraph & LangChain
- Ollama (`llama3.1:8b`)
- ChromaDB (Persistent Vector Store)
- pdfplumber

---

## 🐳 Getting Started (Docker)

The entire ReguTwin Agentic OS is fully Dockerized, allowing you to spin up the Frontend, Backend, and AI Layer seamlessly with one command.

### Prerequisites
1. **Docker & Docker Compose** installed.
2. **Ollama** running locally on your host machine.
    * Install [Ollama](https://ollama.com/).
    * Pull the model: `ollama run llama3.1:8b`
    * Ensure the Ollama server is running.

### Spin up the environment
1. Clone the repository and navigate to the root directory.
2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
3. Access the services:
   * **Frontend Dashboard:** http://localhost:5173
   * **Backend API:** http://localhost:8000
   * **AI Microservice:** http://localhost:8001

*(Note: The AI container automatically routes its LLM requests to your host machine's Ollama instance via `host.docker.internal`.)*

---

## 💻 Running Locally (Without Docker)

If you prefer to run the services individually for development:

### 1. Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. AI Layer
```bash
cd ai
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

---

## 📁 Project Structure

```text
regutwin-agentic-os/
├── ai/
│   ├── agents/          # Specialized AI modules (Analyst, Mapper, Validator, Conflict Engine)
│   ├── schemas/         # Pydantic schemas for structured LLM outputs
│   ├── vector_db/       # ChromaDB persistent client implementation
│   ├── workflows/       # LangGraph state definitions
│   └── main.py          # FastAPI entry point
├── backend/
│   ├── src/
│   │   ├── controllers/ # Express route controllers
│   │   ├── models/      # Mongoose schemas (Regulation, MAP, Audit)
│   │   ├── routes/      # API endpoints
│   │   └── utils/       # Socket.IO broadcasting logic
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI elements (ConflictWarnings, Toasters)
│   │   ├── pages/       # Dashboard pages (MAPs, Audits, Regulations)
│   │   └── services/    # Axios and Socket.IO API clients
└── docker-compose.yml   # Multi-container orchestration
```

---

## 📜 License

This project is licensed under the MIT License.
