# ReguTwin Agentic OS Backend Architecture

## Purpose

This document explains the complete backend architecture of ReguTwin Agentic OS.

The backend is the central orchestration layer of the platform. It sits between the frontend, AI agents, databases, regulatory workflows, audit systems, notification services, and validation engine.

The backend is not a simple CRUD API.

It is responsible for coordinating the entire compliance lifecycle.

---

# Why the Backend Exists

Without a backend, every component would communicate directly with every other component.

Example:

Frontend → AI
Frontend → MongoDB
Frontend → ChromaDB
Frontend → Validation Engine

This creates:

- Tight coupling
- Security risks
- Difficult maintenance
- Poor scalability

Instead, the backend becomes the single source of orchestration.

```text
Frontend
    ↓
Backend
    ↓
MongoDB
AI Layer
ChromaDB
Notifications
Validation Engine
```

---

# Architectural Philosophy

The backend follows four principles:

## Separation of Concerns

Each layer has a single responsibility.

## Scalability

Modules can evolve independently.

## Auditability

Every action must be traceable.

## AI-First Design

The architecture is designed to work with autonomous agents.

---

# High-Level Backend Architecture

```text
Client Applications
        ↓
API Gateway Layer
        ↓
Routes Layer
        ↓
Controllers Layer
        ↓
Services Layer
        ↓
Repositories Layer
        ↓
Databases

MongoDB
ChromaDB
```

---

# Backend Folder Structure

```text
backend/

src/
├── config/
├── routes/
├── controllers/
├── services/
├── repositories/
├── middleware/
├── validations/
├── database/
├── events/
├── jobs/
├── sockets/
├── utils/
├── modules/
└── server.ts
```

---

# Request Lifecycle

Every request follows the same path.

```text
HTTP Request
      ↓
Route
      ↓
Middleware
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
Database
      ↓
Response
```

---

# Routes Layer

## Responsibility

Routes expose API endpoints.

Example:

```http
POST /api/regulations
GET /api/maps
GET /api/dashboard/stats
```

Routes should only:

- Receive requests
- Forward requests
- Attach middleware

Routes should never contain business logic.

Bad:

```js
router.post("/", async () => {
  // business logic
});
```

Good:

```js
router.post("/", createRegulation);
```

---

# Middleware Layer

Middleware executes before controllers.

## Authentication Middleware

Verifies JWT tokens.

```text
Request
  ↓
Token
  ↓
Validation
  ↓
User Context
```

## Authorization Middleware

Checks user permissions.

Roles:

- Admin
- Compliance Officer
- Manager
- Auditor

## Validation Middleware

Validates request payloads.

Technology:

- Zod

## Rate Limiting

Protects APIs from abuse.

---

# Controller Layer

Controllers handle incoming requests.

Responsibilities:

- Receive request
- Validate request state
- Call service
- Return response

Controllers should not:

- Query databases directly
- Execute business logic

Example:

```text
Create Regulation Request
         ↓
Controller
         ↓
Regulation Service
```

---

# Service Layer

The service layer is the heart of the backend.

All business logic belongs here.

Examples:

- Regulation processing
- MAP creation
- Task assignment
- Validation execution
- Audit generation

Why?

Business rules change frequently.

Keeping them inside services prevents chaos.

---

# Repository Layer

Repositories communicate with databases.

Responsibilities:

- Create records
- Update records
- Delete records
- Query records

Repositories should never contain:

- AI logic
- Business rules
- Validation workflows

---

# Database Layer

ReguTwin uses two databases.

## MongoDB

Operational database.

Stores:

- Users
- Regulations
- MAPs
- Tasks
- Validations
- Notifications
- Audit Logs

## ChromaDB

Semantic intelligence database.

Stores:

- Embeddings
- Regulation vectors
- Similarity relationships
- Historical regulation context

---

# Core Backend Modules

## Authentication Module

Purpose:

Identity and access management.

Responsibilities:

- Registration
- Login
- JWT generation
- Role management

---

## Regulation Module

Purpose:

Manage incoming regulations.

Responsibilities:

- Store regulations
- Manage metadata
- Maintain status

Lifecycle:

Draft → Processing → Active → Archived

---

## MAP Module

Purpose:

Convert obligations into measurable action points.

Example:

Regulation:
Enable timeout after 30 seconds

MAP:
Enable Session Timeout

---

## Task Module

Purpose:

Transform MAPs into executable work.

Status Flow:

Pending
↓
Assigned
↓
In Progress
↓
Completed
↓
Validated

---

## Validation Module

Purpose:

Verify implementation.

Validation types:

- API Validation
- Database Validation
- Security Validation
- Workflow Validation

---

## Audit Module

Purpose:

Maintain evidence.

Stores:

- User actions
- System actions
- AI actions
- Validation results

---

## Dashboard Module

Purpose:

Provide executive visibility.

Endpoints:

- Compliance Score
- Active Risks
- Failed Validations
- Open Tasks

---

# AI Integration Architecture

Backend communicates with the AI layer.

```text
Backend
   ↓
Watchman Agent
Analyst Agent
Mapper Agent
Validator Agent
```

The backend never allows the frontend to communicate directly with AI agents.

Benefits:

- Security
- Centralized logging
- Easier monitoring

---

# Event-Driven Architecture

ReguTwin uses events for decoupling.

Example:

```text
Regulation Created
        ↓
Event Published
        ↓
Analyst Triggered
        ↓
MAP Engine Triggered
        ↓
Conflict Engine Triggered
```

Benefits:

- Scalability
- Reduced coupling
- Easier maintenance

---

# Background Jobs

Some processes should not run during API requests.

Examples:

- Regulation monitoring
- Validation execution
- Notification delivery
- Cleanup tasks

These run through scheduled jobs.

```text
jobs/

regulationMonitor.job.ts
validation.job.ts
notification.job.ts
cleanup.job.ts
```

---

# Real-Time Architecture

Socket.IO provides real-time updates.

Events:

```text
regulation:new

map:created

task:assigned

validation:failed

conflict:detected
```

Benefits:

- Live dashboard
- Immediate notifications
- Better user experience

---

# Error Handling Strategy

Centralized error handling.

```text
Application Error
       ↓
Error Middleware
       ↓
Standard Response
```

Response Format:

```json
{
  "success": false,
  "message": "Validation failed"
}
```

---

# Logging Strategy

Every important action should be logged.

Examples:

- Login
- Regulation creation
- Task assignment
- Validation execution

Technology:

- Winston

Log Levels:

- Info
- Warning
- Error
- Critical

---

# Security Architecture

Security is mandatory.

## Authentication

JWT

## Authorization

Role-Based Access Control

## Validation

Zod

## Encryption

Sensitive data encryption

## Rate Limiting

API protection

## Audit Trails

Full traceability

---

# Future Scalability

MVP Architecture:

```text
Frontend
Backend
MongoDB
AI Layer
ChromaDB
```

Enterprise Architecture:

```text
Frontend
      ↓
API Gateway
      ↓
Microservices

Auth Service
Regulation Service
Validation Service
Notification Service
AI Service

Mongo Cluster
Redis Cluster
Chroma Cluster
```

---

# Development Order

1. Backend Foundation
2. Authentication
3. Regulation Module
4. MAP Module
5. Task Module
6. Audit Module
7. Validation Module
8. Dashboard Module
9. Notification Module
10. Real-Time Layer
11. AI Integration
12. Production Hardening

---

# Key Takeaways

The backend is the central nervous system of ReguTwin.

Its responsibilities include:

- Orchestrating workflows
- Managing regulations
- Coordinating AI agents
- Maintaining audit evidence
- Enforcing security
- Providing real-time visibility

A well-designed backend ensures that every regulation can move from detection to validation in a controlled, traceable, and scalable manner.
