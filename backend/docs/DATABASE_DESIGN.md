# ReguTwin Agentic OS Database Design

## Purpose

This document explains the complete database architecture of ReguTwin Agentic OS.

The database is the foundation of the entire platform. Every regulation, task, validation result, audit log, conflict analysis, and compliance action eventually becomes data.

Understanding the database design is critical before implementing backend services, AI workflows, or APIs.

---

# Why Database Design Matters

Many projects fail because developers start creating collections without understanding:

- Data relationships
- Data lifecycle
- Query patterns
- Scalability requirements
- AI integration requirements

ReguTwin processes a large volume of regulatory intelligence.

The database must support:

- Regulatory storage
- Compliance workflows
- AI reasoning
- Audit evidence
- Real-time dashboards
- Historical analysis

---

# Database Architecture

ReguTwin uses two database systems.

```text
ReguTwin

├── MongoDB
│
└── ChromaDB
```

Each database has a different responsibility.

---

# MongoDB

## Purpose

MongoDB is the operational database.

It stores structured application data.

Examples:

- Users
- Regulations
- MAPs
- Tasks
- Validations
- Notifications
- Audit Logs

MongoDB becomes the source of truth for platform operations.

---

# ChromaDB

## Purpose

ChromaDB is the semantic intelligence database.

It stores:

- Regulation embeddings
- Historical compliance knowledge
- Similarity relationships
- Conflict intelligence

ChromaDB powers:

- Semantic search
- Conflict detection
- Context retrieval
- RAG workflows

---

# High-Level Data Flow

```text
Regulation
      ↓
Analysis
      ↓
MAP
      ↓
Task
      ↓
Validation
      ↓
Audit Evidence
```

This is the core lifecycle of ReguTwin.

---

# MongoDB Collections

```text
users

regulations

maps

tasks

validations

conflicts

notifications

audit_logs

dashboard_metrics
```

---

# Users Collection

## Purpose

Stores platform users.

Every action inside ReguTwin belongs to a user.

---

## Schema

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "passwordHash": "...",
  "role": "Compliance Officer",
  "department": "IT Security",
  "isActive": true,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Why Each Field Exists

### name

Human-readable identity.

### email

Unique login identifier.

### passwordHash

Never store plain passwords.

### role

Access control.

### department

Used for task assignment.

### isActive

Account status.

---

## Indexes

```text
email
role
department
```

---

# Regulations Collection

## Purpose

Stores all regulatory documents.

This is the entry point of the compliance workflow.

---

## Schema

```json
{
  "_id": "ObjectId",
  "regulationId": "RBI-2026-001",
  "title": "KYC Session Timeout",
  "source": "RBI",
  "pdfUrl": "...",
  "issueDate": "Date",
  "effectiveDate": "Date",
  "status": "ACTIVE",
  "rawContent": "...",
  "summary": "...",
  "riskLevel": "HIGH",
  "createdAt": "Date"
}
```

---

## Status Values

```text
NEW

PROCESSING

ACTIVE

ARCHIVED
```

---

## Why This Collection Exists

Without regulations there is no compliance workflow.

Everything starts here.

---

## Indexes

```text
regulationId

source

issueDate

status
```

---

# MAP Collection

MAP = Measurable Action Point

This is the most important collection in the platform.

---

## Purpose

Stores actionable compliance requirements.

---

## Example

Regulation:

Enable session timeout after 30 seconds.

MAP:

Enable Session Timeout

---

## Schema

```json
{
  "_id": "ObjectId",
  "regulationId": "ObjectId",
  "title": "Enable Session Timeout",
  "description": "...",
  "department": "IT Security",
  "priority": "HIGH",
  "deadline": "Date",
  "riskLevel": "HIGH",
  "status": "OPEN"
}
```

---

## Relationships

```text
One Regulation
        ↓
Many MAPs
```

---

# Tasks Collection

## Purpose

Transforms MAPs into executable work.

---

## Schema

```json
{
  "_id": "ObjectId",
  "mapId": "ObjectId",
  "assignedTo": "ObjectId",
  "status": "PENDING",
  "dueDate": "Date",
  "remarks": "",
  "createdAt": "Date"
}
```

---

## Status Flow

```text
PENDING

ASSIGNED

IN_PROGRESS

COMPLETED

FAILED
```

---

## Relationships

```text
One MAP
      ↓
Many Tasks
```

---

# Validations Collection

## Purpose

Stores compliance verification results.

This collection powers proof-based compliance.

---

## Schema

```json
{
  "_id": "ObjectId",
  "mapId": "ObjectId",
  "validationType": "API",
  "result": "PASS",
  "evidence": "...",
  "executedAt": "Date"
}
```

---

## Validation Types

```text
API

DATABASE

SECURITY

WORKFLOW

CONFIGURATION
```

---

## Result Types

```text
PASS

FAIL
```

---

# Conflicts Collection

## Purpose

Stores detected regulatory conflicts.

---

## Example

RBI:

30-second timeout

SEBI:

60-second timeout

Conflict detected.

---

## Schema

```json
{
  "_id": "ObjectId",
  "regulationA": "ObjectId",
  "regulationB": "ObjectId",
  "similarityScore": 0.92,
  "conflictReason": "...",
  "createdAt": "Date"
}
```

---

# Notifications Collection

## Purpose

Stores notifications generated by the system.

---

## Schema

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "type": "VALIDATION_FAILED",
  "message": "...",
  "isRead": false,
  "createdAt": "Date"
}
```

---

# Audit Logs Collection

## Purpose

Most important collection for governance.

Tracks every important action.

---

## Schema

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "action": "CREATE_MAP",
  "resourceType": "MAP",
  "resourceId": "ObjectId",
  "metadata": {},
  "timestamp": "Date"
}
```

---

## Examples

```text
User Logged In

Task Assigned

Task Updated

Validation Executed

Conflict Detected

Regulation Created
```

---

# Dashboard Metrics Collection

## Purpose

Precomputed analytics.

Improves dashboard performance.

---

## Schema

```json
{
  "_id": "ObjectId",
  "totalRegulations": 120,
  "activeTasks": 350,
  "failedValidations": 12,
  "complianceScore": 92,
  "updatedAt": "Date"
}
```

---

# Collection Relationships

```text
User
 │
 ├── Tasks
 │
 └── Audit Logs

Regulation
 │
 ├── MAPs
 │
 └── Conflicts

MAP
 │
 ├── Tasks
 │
 └── Validations
```

---

# ChromaDB Design

## Why ChromaDB Exists

MongoDB stores facts.

ChromaDB stores meaning.

---

## Example

Regulation A:

Disable session after 30 seconds.

Regulation B:

Automatically terminate session after half a minute.

Different words.

Same meaning.

MongoDB cannot detect this.

ChromaDB can.

---

# Chroma Collection Structure

```json
{
  "id": "regulation_001",
  "document": "...",
  "embedding": [],
  "metadata": {
    "source": "RBI",
    "year": 2026
  }
}
```

---

# Embedding Lifecycle

```text
Regulation
     ↓
Embedding Model
     ↓
Vector Generated
     ↓
Stored in ChromaDB
```

---

# Semantic Search Flow

```text
New Regulation
       ↓
Embedding Created
       ↓
Vector Search
       ↓
Top Similar Regulations
       ↓
Conflict Analysis
```

---

# Data Retention Strategy

## Regulations

Retain permanently.

## Audit Logs

Retain permanently.

## Validations

Retain minimum 7 years.

## Notifications

Retain 90 days.

## Dashboard Metrics

Retain rolling history.

---

# Multi-Tenant Future Design

Future enterprise version should support:

```text
Bank A

Bank B

Bank C
```

Every collection should eventually contain:

```json
{
  "tenantId": "bank_001"
}
```

This prevents data leakage.

---

# Backup Strategy

MongoDB

- Daily backup
- Weekly full backup

ChromaDB

- Daily snapshot

Audit Logs

- Immutable archive

---

# Common Design Mistakes

Do NOT:

- Store passwords in plain text
- Store large PDFs in MongoDB
- Mix AI data with transactional data
- Put business logic inside schemas

Instead:

- Use password hashes
- Use object storage for PDFs
- Use ChromaDB for vectors
- Keep logic in services

---

# Database Development Order

1. Users Collection
2. Regulations Collection
3. MAP Collection
4. Tasks Collection
5. Audit Logs Collection
6. Validation Collection
7. Notifications Collection
8. Dashboard Metrics
9. ChromaDB Integration

---

# Key Takeaways

MongoDB manages operational compliance data.

ChromaDB manages semantic intelligence.

Together they enable:

- Compliance workflows
- Regulatory intelligence
- Conflict detection
- AI reasoning
- Audit readiness
- Real-time reporting

A strong database design ensures every regulation can move through the complete lifecycle from discovery to validated compliance evidence.
