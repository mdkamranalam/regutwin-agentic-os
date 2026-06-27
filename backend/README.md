# ⚙️ ReguTwin Backend Engine & API Gateway

## Overview

The **ReguTwin Backend Orchestrator** is a high-concurrency Node.js + Express + TypeScript server that acts as the central state manager and data bridge between the **React Frontend Workspace** and the **Python LangGraph AI Swarm**.

It persists complex regulatory lifecycles in MongoDB, enforces strict Departmental RBAC scoping, orchestrates asynchronous WebSocket streams, triggers automated SLA cron penalizations, and seals audit events within an immutable WORM cryptographic vault.

---

## 🏛️ Core Responsibilities

*   **REST API Gateway:** Serves structured endpoints for regulations, MAPs, task management, conflict registers, and audit verification.
*   **Real-Time Event Orchestrator:** Broadcasts bi-directional Socket.IO telemetry events (`agent:thinking`, `map:created`, `conflict:detected`, `validation:passed`) to connected UI dashboards.
*   **WORM Governance Vault:** Computes and verifies SHA-256 cryptographic signatures on all compliance evidence records.
*   **RBAC Scoping Middleware:** Intercepts tenant headers (`x-user-role`, `x-user-department`) to isolate departmental data access dynamically.
*   **SLA Penalty Engine:** Runs scheduled background background workers (`scheduler.ts`) to scan overdue tasks and apply dynamic 3× risk degradation penalties to the enterprise compliance health score.

---

## 🛠️ Technology Stack

*   **Runtime:** Node.js v20+, Express.js v4
*   **Language:** TypeScript 5+
*   **Database:** MongoDB & Mongoose ODM
*   **Real-Time Telemetry:** Socket.IO v4
*   **Validation:** Zod Schema Validation
*   **Security:** JWT Authentication, Crypto SHA-256 Hashing, Helmet, CORS

---

## 🚀 Quickstart & Setup

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration (`.env`)
Create a `.env` file in the root of the `/backend` directory:
```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/regutwin
JWT_SECRET=super_secret_jwt_key_2026
FRONTEND_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8001
INTERNAL_SECRET=regutwin_internal_secret_2026
DEMO_MODE=true
```

### 3. Execution
```bash
# Development server with hot-reload (ts-node-dev)
npm run dev

# Build production TypeScript bundle
npm run build
npm start
```

---

## 📡 REST API Reference

| HTTP Method | Endpoint | Description | Access Scope |
| :---: | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Gateway heartbeat & AI service health check | Public |
| `POST` | `/api/v1/auth/register` | Register new compliance officer / admin | Public |
| `POST` | `/api/v1/auth/login` | Authenticate & receive JWT token | Public |
| `GET` | `/api/v1/regulations` | Fetch active regulations list | Scoped by Dept |
| `POST` | `/api/v1/regulations/ingest` | Trigger AI Watchman scraping / ingestion | Admin / Officer |
| `GET` | `/api/v1/maps` | Fetch generated Measurable Action Points | Scoped by Dept |
| `PATCH` | `/api/v1/maps/:id/status` | Transition MAP ticket status (`OPEN` $\rightarrow$ `IN_PROGRESS`) | Assignee / Admin |
| `POST` | `/api/v1/maps/:id/validate` | Dispatch automated HTTP probe validation test | Officer / Admin |
| `GET` | `/api/v1/conflicts` | Fetch semantic vector deadlocks registry | Public / Officer |
| `GET` | `/api/v1/audits` | Fetch immutable WORM governance ledger | Admin / Auditor |
| `POST` | `/api/v1/audits/verify` | Execute cryptographic SHA-256 seal verification | Public / Auditor |

---

## ⚡ Real-Time Socket.IO Telemetry Events

The server emits live operational events over WebSockets to ensure zero-latency UI dashboard updates:

*   `regulation:ingested` — Emitted when Watchman finishes parsing a circular.
*   `agent:node_transition` — Streams live LangGraph state graph node updates (`Analyst` $\rightarrow$ `Conflict Engine` $\rightarrow$ `Mapper`).
*   `map:created` — Emitted when a new Measurable Action Point is assigned to a department.
*   `conflict:flagged` — Emitted when ChromaDB detects contradictory regulatory requirements.
*   `validation:result` — Emitted when sandboxed API probe testing passes or fails.
*   `sla:escalation` — Broadcasted hourly when overdue tasks trigger 3× risk penalties.

---

## 🔐 WORM Cryptographic Vault Architecture

To prevent historical record tampering during banking audits, the backend enforces a Write-Once-Read-Many (WORM) pattern:

1.  **Seal Generation:** When a compliance action is verified or closed, `crypto.createHash('sha256')` digests the action payload, user ID, evidence text, and timestamp.
2.  **Mongoose Immutability Hook:** A pre-save interceptor on `AuditSchema` locks existing documents. Calling `.updateOne()`, `.findOneAndUpdate()`, or `.deleteOne()` throws a strict database-level violation error.
3.  **On-Demand Verification:** The `/audits/verify` route recalculates the live digest against the persisted hash, returning `INTEGRITY_VERIFIED` only if the signatures match exactly.
