"""
ReguTwin Agentic Regulation Flow (Phase 9 Upgrade)
====================================================
Upgrades the LangGraph workflow from a dumb linear pipeline into a real
agentic loop with:

  1. RETRY LOGIC      — If the analyst returns 0 obligations, retry up to
                        MAX_EXTRACT_RETRIES times before marking as failed.

  2. CONDITIONAL EDGES — After conflict detection, routes HIGH/CRITICAL risk
                        regulations through a dedicated Legal Reviewer node
                        before MAP generation begins.

  3. HUMAN-IN-THE-LOOP — For CRITICAL risk regulations, the graph pauses and
                        emits a Socket.IO event asking a human reviewer to
                        approve before MAP generation proceeds. The thread
                        state is persisted by MemorySaver so the workflow can
                        be resumed from the backend.

  4. CHECKPOINTING     — Uses LangGraph's built-in MemorySaver so graph state
                        survives WebSocket reconnects and can be resumed by
                        thread_id via the resume_regulation_flow() helper.

Graph topology:
  extract
    ├─[no obligations, retry]──▶ extract  (up to MAX_EXTRACT_RETRIES)
    └─[obligations found]──────▶ detect_conflicts
                                    ├─[LOW/MEDIUM]───────────────────▶ generate_maps ──▶ END
                                    ├─[HIGH]────────▶ legal_review ──▶ generate_maps ──▶ END
                                    └─[CRITICAL]────▶ legal_review ──▶ await_approval ──▶ (PAUSED)
                                                                              │
                                                              (human approval via backend)
                                                                              │
                                                                     generate_maps ──▶ END
"""

from typing import TypedDict, Optional, Literal
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from agents.analyst import analyze_regulation
from agents.conflict_engine import detect_conflicts, ConflictReport
from agents.mapper.map_generator import generate_maps
from agents.mapper.mapper_agent import assign_departments
from agents.legal_reviewer import perform_legal_review, LegalReviewSummary
from schemas.analysis import RegulationAnalysis
from schemas.map import AssignedMAPList

import requests
import os

# ─── Configuration ────────────────────────────────────────────────────────────
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3000/api/v1")
MAX_EXTRACT_RETRIES = 3

# ─── Graph State ──────────────────────────────────────────────────────────────

class RegulationState(TypedDict):
    # Core inputs
    regulation_id: str
    text: str
    title: str
    source: str

    # Populated by nodes
    analysis: Optional[RegulationAnalysis]
    conflicts: Optional[ConflictReport]
    legal_review: Optional[LegalReviewSummary]
    maps: Optional[AssignedMAPList]

    # Retry counter for the extract node
    retry_count: int

    # HITL flag — set to True when the graph pauses for human approval
    awaiting_approval: bool

    # Routing signal set by detect_conflicts_node, read by should_escalate edge
    # Possible values: "low_medium", "high", "critical"
    risk_routing: str


# ─── Helpers ──────────────────────────────────────────────────────────────────

def broadcast_update(regulation_id: str, node: str, status: str, payload: dict = None):
    """Fire-and-forget HTTP POST to the backend WebSocket bridge."""
    try:
        requests.post(
            f"{BACKEND_URL}/internal/workflow-update",
            headers={"X-Internal-Secret": "regutwin_secret_key"},
            json={
                "regulationId": regulation_id,
                "node": node,
                "status": status,
                "payload": payload,
            },
            timeout=5,
        )
    except Exception as e:
        print(f"[broadcast] Failed to send update: {e}")


def broadcast_hitl_request(regulation_id: str, thread_id: str, legal_review: LegalReviewSummary):
    """
    Notify the backend that a CRITICAL regulation needs human approval.
    The backend will forward this to the frontend via Socket.IO.
    """
    try:
        requests.post(
            f"{BACKEND_URL}/internal/hitl-request",
            headers={"X-Internal-Secret": "regutwin_secret_key"},
            json={
                "regulationId": regulation_id,
                "threadId": thread_id,
                "legalRisk": legal_review.overall_legal_risk if legal_review else "Unknown",
                "recommendedAction": legal_review.recommended_action if legal_review else "ESCALATE_TO_LEGAL_TEAM",
                "rationale": legal_review.rationale if legal_review else "",
            },
            timeout=5,
        )
    except Exception as e:
        print(f"[broadcast_hitl] Failed to send HITL request: {e}")



# ─── Node Definitions ─────────────────────────────────────────────────────────

def extract_obligations(state: RegulationState) -> dict:
    """
    Analyst Agent node: extracts structured obligations from raw regulation text.
    Increments retry_count on each invocation.
    """
    attempt = state.get("retry_count", 0) + 1
    print(f"[Node: extract] Attempt {attempt}/{MAX_EXTRACT_RETRIES} for {state['regulation_id']}")
    broadcast_update(state["regulation_id"], "extract", "IN_PROGRESS", {"attempt": attempt})

    analysis = analyze_regulation(
        text=state["text"],
        regulation_id=state["regulation_id"],
        title=state["title"],
        source=state["source"],
    )

    if analysis and analysis.obligations:
        broadcast_update(state["regulation_id"], "extract", "COMPLETED", {
            "obligations_count": len(analysis.obligations),
            "risk_level": analysis.risk_level,
        })
    else:
        broadcast_update(state["regulation_id"], "extract", "RETRY", {"attempt": attempt})

    return {"analysis": analysis, "retry_count": attempt}


def detect_conflicts_node(state: RegulationState) -> dict:
    """
    Conflict Engine node: queries ChromaDB for semantically similar obligations
    and uses the LLM to verify genuine conflicts.
    Also sets the `risk_routing` signal for the downstream conditional edge.
    """
    print(f"[Node: detect_conflicts] Processing {state['regulation_id']}")
    broadcast_update(state["regulation_id"], "detect_conflicts", "IN_PROGRESS")

    analysis = state.get("analysis")
    conflicts = None

    if analysis and analysis.obligations:
        conflicts = detect_conflicts(state["regulation_id"], analysis.obligations)
        broadcast_update(state["regulation_id"], "detect_conflicts", "COMPLETED", {
            "conflicts_found": len(conflicts.conflicts) if conflicts else 0,
        })
    else:
        broadcast_update(state["regulation_id"], "detect_conflicts", "COMPLETED", {"conflicts_found": 0})

    # Determine risk routing based on the analysis risk level
    risk_level = (analysis.risk_level or "Low").strip().upper() if analysis else "LOW"
    if risk_level == "CRITICAL":
        routing = "critical"
    elif risk_level == "HIGH":
        routing = "high"
    else:
        routing = "low_medium"

    return {"conflicts": conflicts, "risk_routing": routing}


def legal_review_node(state: RegulationState) -> dict:
    """
    Legal Reviewer node (Phase 9): performs deep legal analysis on HIGH/CRITICAL
    risk regulations. Only reached via conditional edge from detect_conflicts.
    """
    print(f"[Node: legal_review] Performing legal review for {state['regulation_id']}")
    broadcast_update(state["regulation_id"], "legal_review", "IN_PROGRESS")

    analysis = state.get("analysis")
    conflicts = state.get("conflicts")

    conflicts_summary = "No conflicts detected."
    if conflicts and conflicts.conflicts:
        lines = [
            f"- Conflict with '{c.conflicting_title}': {c.explanation}"
            for c in conflicts.conflicts
        ]
        conflicts_summary = "\n".join(lines)

    review = perform_legal_review(
        regulation_title=analysis.title if analysis else state["title"],
        regulation_summary=analysis.summary if analysis else "",
        obligations=analysis.obligations if analysis else [],
        conflicts_summary=conflicts_summary,
    )

    broadcast_update(state["regulation_id"], "legal_review", "COMPLETED", {
        "overall_legal_risk": review.overall_legal_risk if review else "Unknown",
        "recommended_action": review.recommended_action if review else "ESCALATE_TO_LEGAL_TEAM",
    })

    return {"legal_review": review}


def await_human_approval_node(state: RegulationState) -> dict:
    """
    HITL gate (Phase 9): pauses the graph for CRITICAL risk regulations.
    Broadcasts a hitl_request event to the backend, which forwards it to
    the frontend NotificationCenter. The workflow resumes only when a human
    calls the /internal/approve-workflow endpoint.

    NOTE: In LangGraph, this node returns normally — the graph is interrupted
    by the interrupt_before/interrupt_after mechanism compiled into the graph.
    We broadcast the HITL event here so the frontend knows to show the
    approval UI.
    """
    print(f"[Node: await_approval] Waiting for human approval on {state['regulation_id']}")
    broadcast_update(state["regulation_id"], "await_approval", "WAITING_FOR_HUMAN")

    # Broadcast HITL request via backend → Socket.IO → Frontend
    # thread_id is the regulation_id (used as the LangGraph thread identifier)
    broadcast_hitl_request(
        regulation_id=state["regulation_id"],
        thread_id=state["regulation_id"],
        legal_review=state.get("legal_review"),
    )

    return {"awaiting_approval": True}


def generate_maps_node(state: RegulationState) -> dict:
    """
    MAP Generator node: converts extracted obligations into Measurable Action
    Points and routes them to the correct department.
    """
    print(f"[Node: generate_maps] Generating MAPs for {state['regulation_id']}")
    broadcast_update(state["regulation_id"], "generate_maps", "IN_PROGRESS")

    analysis = state.get("analysis")
    if analysis and analysis.obligations:
        map_list = generate_maps(analysis)
        assigned = assign_departments(map_list)
        broadcast_update(state["regulation_id"], "generate_maps", "COMPLETED", {
            "maps_count": len(assigned.maps) if assigned else 0,
        })
        return {"maps": assigned}

    broadcast_update(state["regulation_id"], "generate_maps", "COMPLETED", {"maps_count": 0})
    return {"maps": None}


# ─── Conditional Edge Functions ───────────────────────────────────────────────

def should_retry_extract(state: RegulationState) -> Literal["retry", "proceed"]:
    """
    After extract node: if obligations list is empty AND we haven't exhausted
    our retries, go back to extract. Otherwise proceed to conflict detection.
    """
    analysis = state.get("analysis")
    retry_count = state.get("retry_count", 0)
    has_obligations = bool(analysis and analysis.obligations)

    if not has_obligations and retry_count < MAX_EXTRACT_RETRIES:
        print(f"[Edge: should_retry] No obligations found, retry {retry_count}/{MAX_EXTRACT_RETRIES}")
        return "retry"

    return "proceed"


def should_escalate(state: RegulationState) -> Literal["low_medium", "high", "critical"]:
    """
    After detect_conflicts node: route based on risk_routing signal.
      - low_medium → generate_maps (fast path)
      - high       → legal_review → generate_maps
      - critical   → legal_review → await_approval → (PAUSED)
    """
    routing = state.get("risk_routing", "low_medium")
    print(f"[Edge: should_escalate] Routing: {routing}")
    return routing  # type: ignore[return-value]


def after_legal_review(state: RegulationState) -> Literal["generate_maps", "await_approval"]:
    """
    After legal_review node: CRITICAL risk goes to human approval gate,
    HIGH risk proceeds directly to MAP generation.
    """
    routing = state.get("risk_routing", "high")
    if routing == "critical":
        return "await_approval"
    return "generate_maps"


# ─── Build the Graph ──────────────────────────────────────────────────────────

def _build_workflow() -> StateGraph:
    workflow = StateGraph(RegulationState)

    # Register nodes
    workflow.add_node("extract", extract_obligations)
    workflow.add_node("detect_conflicts", detect_conflicts_node)
    workflow.add_node("legal_review", legal_review_node)
    workflow.add_node("await_approval", await_human_approval_node)
    workflow.add_node("generate_maps", generate_maps_node)

    # Entry point
    workflow.set_entry_point("extract")

    # Conditional: retry or proceed after extraction
    workflow.add_conditional_edges(
        "extract",
        should_retry_extract,
        {
            "retry": "extract",       # Loop back for retry
            "proceed": "detect_conflicts",
        },
    )

    # Conditional: risk-based routing after conflict detection
    workflow.add_conditional_edges(
        "detect_conflicts",
        should_escalate,
        {
            "low_medium": "generate_maps",   # Fast path
            "high": "legal_review",          # Legal review, then MAPs
            "critical": "legal_review",      # Legal review, then HITL gate
        },
    )

    # Conditional: after legal review, HIGH goes to MAPs, CRITICAL to HITL
    workflow.add_conditional_edges(
        "legal_review",
        after_legal_review,
        {
            "generate_maps": "generate_maps",
            "await_approval": "await_approval",
        },
    )

    # await_approval is an interrupt point — in HITL mode the graph pauses here.
    # When resumed, it proceeds to generate_maps.
    workflow.add_edge("await_approval", "generate_maps")

    # Terminal edge
    workflow.add_edge("generate_maps", END)

    return workflow


# Compile with MemorySaver checkpointer for HITL resume support
_checkpointer = MemorySaver()
_workflow = _build_workflow()
regulation_app = _workflow.compile(
    checkpointer=_checkpointer,
    # Interrupt before await_approval so the graph truly pauses at the HITL gate
    interrupt_before=["await_approval"],
)


# ─── Public API ───────────────────────────────────────────────────────────────

def run_regulation_flow(
    regulation_id: str,
    text: str,
    title: str = "Unknown",
    source: str = "Unknown",
) -> RegulationState:
    """
    Helper function to start the full LangGraph workflow for a regulation.
    Uses the regulation_id as the LangGraph thread_id so the state can be
    resumed later via resume_regulation_flow().
    """
    initial_state = RegulationState(
        regulation_id=regulation_id,
        text=text,
        title=title,
        source=source,
        analysis=None,
        conflicts=None,
        legal_review=None,
        maps=None,
        retry_count=0,
        awaiting_approval=False,
        risk_routing="low_medium",
    )

    config = {"configurable": {"thread_id": regulation_id}}
    final_state = regulation_app.invoke(initial_state, config=config)
    return final_state


def resume_regulation_flow(regulation_id: str) -> RegulationState:
    """
    Resumes a CRITICAL risk regulation workflow that was paused at the
    await_approval HITL gate. Called from the backend after a human approves.

    The graph state is loaded from MemorySaver using the regulation_id as
    the thread_id. The workflow continues from await_approval → generate_maps.
    """
    print(f"[resume_regulation_flow] Resuming workflow for {regulation_id}")

    config = {"configurable": {"thread_id": regulation_id}}

    # Resume: invoke with None input — LangGraph resumes from checkpoint
    final_state = regulation_app.invoke(None, config=config)

    broadcast_update(regulation_id, "workflow", "RESUMED_AFTER_APPROVAL")
    return final_state


def get_workflow_state(regulation_id: str) -> Optional[RegulationState]:
    """
    Returns the current persisted state of a workflow by regulation_id.
    Useful for inspecting paused workflows from the backend.
    """
    config = {"configurable": {"thread_id": regulation_id}}
    snapshot = regulation_app.get_state(config)
    if snapshot:
        return snapshot.values
    return None