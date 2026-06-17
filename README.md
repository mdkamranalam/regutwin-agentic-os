# ReguTwin Agentic OS

ReguTwin Agentic OS is an Autonomous Regulatory Intelligence and Compliance Operating System that helps banks transform manual compliance workflows into AI-driven, real-time, proof-based regulatory operations.

## Problem

Banks continuously receive regulatory updates from authorities such as RBI and SEBI. Most compliance workflows still rely on emails, spreadsheets, manual interpretation, and delayed implementation tracking, resulting in:

- Compliance gaps
- Increased audit risks
- Slow implementation cycles
- Operational inefficiencies
- Poor visibility into compliance status

## Solution

ReguTwin uses autonomous AI agents to continuously monitor regulations, extract compliance obligations, generate measurable action points, detect regulatory conflicts, assign ownership, and validate implementation through automated testing.

## Architecture

Regulatory Sources (RBI / SEBI / PDFs / Portals)
→ Watchman Agent
→ Analyst Agent
→ MAP Generation Engine
→ Semantic Conflict Engine
→ Mapper Agent
→ Validation Agent
→ Governance & Audit Layer
→ Compliance Dashboard

## Key Features

- Real-time regulatory monitoring
- AI-powered regulation analysis
- Measurable Action Point (MAP) generation
- Department ownership mapping
- Semantic conflict detection
- Autonomous compliance validation
- Proof-based verification
- Governance and audit trails
- Real-time compliance dashboard

## Docker Setup

The entire ReguTwin Agentic OS is fully Dockerized, allowing you to run the Frontend, Backend, and AI Layer together seamlessly.

### Prerequisites
- Docker & Docker Compose
- [Ollama](https://ollama.com/) running locally on your host machine (with the `llama3.1:8b` model pulled).

### Running the Application
1. Start your local Ollama instance.
2. In the root directory, build and start the containers:
   ```bash
   docker-compose up --build
   ```
3. Access the services:
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:8000
   - **AI Layer API:** http://localhost:8001

## Technology Stack

- React.js (Vite, TailwindCSS)
- Node.js
- Express.js
- LangGraph
- OpenAI / Gemini APIs
- ChromaDB
- MongoDB

## Example Workflow

1. Watchman Agent detects a new RBI circular.
2. Analyst Agent extracts obligations, deadlines, risks, and impacted systems.
3. MAP Engine generates actionable compliance tasks.
4. Conflict Engine identifies contradictory regulatory requirements.
5. Mapper Agent assigns tasks to relevant departments.
6. Validation Agent verifies implementation through automated testing.
7. Dashboard provides real-time compliance visibility and audit evidence.

## Expected Impact

ReguTwin enables banks to:

- Reduce regulatory response time
- Improve compliance accuracy
- Detect policy conflicts early
- Minimize audit risks
- Strengthen governance and cybersecurity compliance

## Future Scope

- Multi-regulator support
- Automated evidence collection
- Continuous compliance monitoring
- Predictive compliance risk scoring
- Enterprise integrations

## License

This project is licensed under the MIT License.
