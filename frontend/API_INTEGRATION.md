# API_INTEGRATION.md

# ReguTwin Agentic OS API Integration Guide

## Purpose

This document defines how the frontend communicates with the backend.

It serves as the official API contract between:

```txt
Frontend Team

↕

Backend Team

↕

AI Team
```

The goal is to ensure:

* Consistent API design
* Predictable responses
* Easy React Query integration
* Scalable architecture
* Clear ownership boundaries

---

# Integration Philosophy

The frontend never communicates directly with:

```txt
OpenAI

Gemini

LangGraph

ChromaDB

AI Agents
```

All communication must flow through backend APIs.

Architecture:

```txt
Frontend

↓

Backend API

↓

AI Layer

↓

Database
```

The backend acts as the single gateway.

---

# Base URL

Development:

```txt
http://localhost:5000/api
```

Production:

```txt
https://api.regutwin.com/api
```

Centralized configuration:

```ts
const API_BASE_URL =
  import.meta.env.VITE_API_URL;
```

---

# API Folder Structure

Frontend:

```txt
src/
│
├── services/
│   ├── authService.ts
│   ├── dashboardService.ts
│   ├── regulationService.ts
│   ├── mapService.ts
│   ├── conflictService.ts
│   ├── validationService.ts
│   ├── auditService.ts
│   ├── notificationService.ts
│   └── adminService.ts
```

Each service owns a single domain.

---

# API Client

Single Axios instance.

```ts
src/services/api.ts
```

Responsibilities:

* Base URL
* Authentication headers
* Interceptors
* Error handling

Example:

```ts
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});
```

Never create multiple Axios instances.

---

# Standard API Response Format

Every endpoint should return:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

# Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {}
}
```

Never return inconsistent response structures.

---

# Authentication APIs

---

## Login

Endpoint:

```txt
POST /auth/login
```

Request:

```json
{
  "email": "user@bank.com",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {}
  }
}
```

Used By:

```txt
Login Page
```

---

## Logout

Endpoint:

```txt
POST /auth/logout
```

Purpose:

Invalidate session.

---

## Current User

Endpoint:

```txt
GET /auth/me
```

Purpose:

Restore session after refresh.

---

# Dashboard APIs

---

## Dashboard Summary

Endpoint:

```txt
GET /dashboard/summary
```

Response:

```json
{
  "complianceScore": 92,
  "activeRegulations": 18,
  "pendingMaps": 12,
  "failedValidations": 2,
  "conflicts": 3
}
```

Used By:

```txt
Dashboard Cards
```

---

## Dashboard Analytics

Endpoint:

```txt
GET /dashboard/analytics
```

Response:

```json
{
  "complianceTrend": [],
  "riskDistribution": [],
  "departmentStats": []
}
```

Used By:

```txt
Charts
```

---

# Regulation APIs

---

## Get Regulations

Endpoint:

```txt
GET /regulations
```

Query Parameters:

```txt
?page=1

&limit=20

&risk=high

&search=kyc
```

Response:

```json
{
  "items": [],
  "total": 50
}
```

---

## Get Regulation Details

Endpoint:

```txt
GET /regulations/:id
```

Response:

```json
{
  "id": "reg-101",
  "title": "RBI KYC Circular",
  "summary": "",
  "obligations": [],
  "riskLevel": "High"
}
```

---

# MAP APIs

MAP = Measurable Action Point

---

## Get MAPs

Endpoint:

```txt
GET /maps
```

Response:

```json
{
  "items": []
}
```

---

## Get MAP Details

Endpoint:

```txt
GET /maps/:id
```

---

## Update MAP Status

Endpoint:

```txt
PATCH /maps/:id
```

Request:

```json
{
  "status": "Completed"
}
```

---

## Upload Evidence

Endpoint:

```txt
POST /maps/:id/evidence
```

Request:

```txt
multipart/form-data
```

Response:

```json
{
  "fileUrl": ""
}
```

---

# Conflict APIs

---

## Get Conflicts

Endpoint:

```txt
GET /conflicts
```

Response:

```json
{
  "items": []
}
```

---

## Get Conflict Details

Endpoint:

```txt
GET /conflicts/:id
```

Response:

```json
{
  "regulationA": {},
  "regulationB": {},
  "severity": "High",
  "recommendation": ""
}
```

---

## Resolve Conflict

Endpoint:

```txt
POST /conflicts/:id/resolve
```

Purpose:

Mark conflict as resolved.

---

# Validation APIs

---

## Get Validations

Endpoint:

```txt
GET /validation
```

Response:

```json
{
  "items": []
}
```

---

## Validation Details

Endpoint:

```txt
GET /validation/:id
```

Response:

```json
{
  "expected": "",
  "actual": "",
  "status": "FAILED"
}
```

---

## Retry Validation

Endpoint:

```txt
POST /validation/:id/retry
```

Purpose:

Trigger Validator Agent again.

---

# Audit APIs

---

## Audit Logs

Endpoint:

```txt
GET /audit
```

Query:

```txt
?page=1

&userId=123

&eventType=validation
```

Response:

```json
{
  "items": [],
  "total": 1000
}
```

---

## Export Audit Report

Endpoint:

```txt
GET /audit/export
```

Response:

```txt
PDF File
```

---

# Notification APIs

---

## Get Notifications

Endpoint:

```txt
GET /notifications
```

---

## Mark As Read

Endpoint:

```txt
PATCH /notifications/:id/read
```

---

## Mark All Read

Endpoint:

```txt
PATCH /notifications/read-all
```

---

# User APIs

---

## User Profile

Endpoint:

```txt
GET /users/profile
```

---

## Update Profile

Endpoint:

```txt
PATCH /users/profile
```

---

## Change Password

Endpoint:

```txt
POST /users/change-password
```

---

# Admin APIs

Administrator only.

---

## Users

```txt
GET /admin/users

POST /admin/users

PATCH /admin/users/:id

DELETE /admin/users/:id
```

---

## Departments

```txt
GET /admin/departments

POST /admin/departments
```

---

## AI Configuration

```txt
GET /admin/ai-config

PATCH /admin/ai-config
```

---

# React Query Integration

Each API should have a corresponding hook.

Structure:

```txt
hooks/
│
├── useDashboard.ts
├── useRegulations.ts
├── useMaps.ts
├── useConflicts.ts
├── useValidation.ts
├── useAudit.ts
└── useNotifications.ts
```

---

# Query Key Convention

Dashboard:

```ts
["dashboard"]
```

Regulations:

```ts
["regulations"]

["regulation", id]
```

MAPs:

```ts
["maps"]

["map", id]
```

Conflicts:

```ts
["conflicts"]

["conflict", id]
```

Validation:

```ts
["validation"]

["validation", id]
```

---

# Mutation Pattern

Example:

Update MAP.

```txt
User Updates Status

↓

PATCH Request

↓

Backend Success

↓

Invalidate Query

↓

Refetch Data

↓

Update UI
```

Example:

```ts
queryClient.invalidateQueries({
  queryKey: ["maps"]
});
```

---

# Authentication Headers

Every protected request should send:

```http
Authorization: Bearer JWT_TOKEN
```

or use:

```txt
HTTP-only Cookie
```

Preferred:

```txt
HTTP-only Cookie
```

for enterprise security.

---

# Socket.IO Events

The backend should emit:

```txt
new-regulation

map-created

map-updated

validation-started

validation-failed

validation-passed

conflict-detected

notification-created
```

---

# Socket Event Handling

Example:

```txt
new-regulation

↓

Invalidate

↓

["regulations"]

↓

Refresh UI
```

Never manually refresh pages.

---

# Error Handling

Every API request must support:

```txt
Loading

Success

Empty

Error
```

Example:

```txt
Loading Regulations...

No Regulations Found

Failed To Load Regulations
```

---

# API Security Rules

Frontend must never access:

```txt
OpenAI API Keys

Gemini API Keys

LangGraph Endpoints

ChromaDB Credentials

Internal Validation Services
```

These remain backend-only resources.

---

# Final Integration Principle

The backend is the single source of truth.

Frontend requests data through APIs.

React Query manages caching.

Socket.IO handles real-time updates.

AI services remain completely hidden behind backend endpoints.

This separation ensures that ReguTwin remains secure, scalable, maintainable, and enterprise-ready.
