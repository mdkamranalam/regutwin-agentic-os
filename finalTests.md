# ReguTwin Agentic OS - Final End-to-End Tests

This document provides a comprehensive step-by-step guide to testing the fully integrated ReguTwin Agentic OS. All three layers—Frontend, Backend, and AI—are now natively communicating.

---

## Prerequisites
Ensure the entire stack is running:
```bash
docker-compose up --build -d
```

*   **Frontend**: `http://localhost:5173`
*   **Backend API**: `http://localhost:8000`
*   **AI Bridge**: `http://localhost:8001`

---

## Test Scenario 1: Autonomous Extraction & WebSocket Progress

This tests the complete pipeline from a user uploading text in the Frontend, to the Backend triggering the LangGraph AI Workflow, to the AI broadcasting live WebSocket updates back to the Frontend.

### Steps:
1. Open the UI at [http://localhost:5173](http://localhost:5173).
2. Navigate to the **Explorer** page (via the Sidebar).
3. Under "Input Regulation Text", paste the following mock regulation:
    ```text
    RBI Mandate 2026: All banking applications must enforce a strict 30-second session timeout for inactive KYC verification portals to prevent unauthorized access.
    ```
4. Click **Start Autonomous Analysis**.
5. **Observe**: 
    * The frontend should instantly establish a WebSocket connection.
    * You should see live "Workflow Progress" indicators appearing sequentially (e.g., *Extracting Obligations*, *Detecting Conflicts*, *Generating MAPs*).
    * Once finished, the extracted regulation should appear in the "Analyzed Regulations" list.

---

## Test Scenario 2: Semantic Conflict Detection

This tests the ChromaDB AI Vector Engine to ensure it correctly identifies contradictions between newly uploaded rules and historical regulations.

### Steps:
1. Ensure the regulation from Test Scenario 1 is uploaded (30-second timeout).
2. Now, paste a second, conflicting regulation into the Explorer page:
    ```text
    SEBI Accessibility Guidelines 2026: Financial portals must allow a minimum of 60 seconds of inactivity during KYC flows to accommodate elderly users.
    ```
3. Click **Start Autonomous Analysis**.
4. **Observe**:
    * The AI Layer should generate the vectors for the new SEBI rule and compare it against the previously stored RBI rule in ChromaDB.
    * You should see a red **Conflict Detected** flag indicating that 30 seconds contradicts the 60-second rule.

---

## Test Scenario 3: Autonomous API-Level Compliance Validation & Real-Time Alerts

This is the flagship feature. It tests the AI acting as a QA Engineer, firing a live HTTP request, catching a failure, and triggering a WebSocket Escalation Alert to a manager.

### Steps:
1. Navigate to the **MAP Dashboard** (`http://localhost:5173/maps`).
2. You should see a MAP generated from Test Scenario 1 (e.g., "Implement 30-second session timeout").
3. Find the **Autonomous API Testing Configuration** block attached to that MAP.
4. Set the following parameters:
    * **Target Endpoint URL**: `http://backend:8000/api/v1/mock/kyc` (This is our mock server that deliberately does not time out).
    * **HTTP Method**: `GET`
    * **Expected Response Substring**: `timeout`
5. Click **Save & Run Live Test**.
6. **Observe**:
    * The UI will show "Running AI Validator...".
    * The Python AI Sandbox will dynamically execute a `GET` request against the Node.js backend.
    * It will analyze the response and realize the word "timeout" is missing and the session did not expire correctly.
    * The AI will mark the compliance check as **FAILED**.
    * Immediately look at the **Bell Icon** in the top right Navbar. You should see a live red unread badge pop up via Socket.IO.
    * Click the Bell to read the exact AI feedback (e.g., "URGENT: MAP Validation Failed. The target API returned...").

---

## Test Scenario 4: Executive Risk Dashboard Analytics

This tests the backend analytics aggregation engine plotting the health data in real-time.

### Steps:
1. Navigate to the **Dashboard** (`http://localhost:5173/dashboard`).
2. **Observe**:
    * You should see the **Compliance Health Score**. Because a MAP just failed validation in Test Scenario 3 and is marked as `OPEN`/`FAILED`, the score should drop below 100 to visually represent Risk.
    * The Pie Chart should dynamically reflect the distribution of Open, In Progress, In Review, and Closed tasks. 

---

## Conclusion

If all four test scenarios succeed, it proves that:
1. The **Backend** is successfully proxying to the **AI Layer**.
2. The **AI Layer** is successfully running complex multi-agent LangGraph workflows.
3. The **AI Layer** is successfully dispatching webhooks to the **Backend**.
4. The **Backend** is successfully broadcasting Socket.IO events to the **Frontend**.
5. The **Frontend** correctly updates its state reactively.

The ReguTwin Agentic OS is fully connected and operational!
