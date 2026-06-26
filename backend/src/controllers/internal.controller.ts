import { Request, Response } from "express";
import Regulation from "../models/regulation.model.js";
import { broadcastWorkflowUpdate, broadcastHITLRequest } from "../utils/socket.js";
import axios from "axios";

export const saveAnalysis = async (req: Request, res: Response) => {
  const { regulationId, analysis } = req.body;

  const regulation = await Regulation.findById(regulationId);

  if (!regulation) {
    return res.status(404).json({
      message: "Regulation not found",
    });
  }

  regulation.analysis = analysis;
  regulation.status = "ANALYZED" as any;
  await regulation.save();

  res.json({ success: true });
};

export const postWorkflowUpdate = async (req: Request, res: Response) => {
  const { regulationId, node, status, payload } = req.body;
  broadcastWorkflowUpdate(regulationId, node, status, payload);
  res.json({ success: true });
};

/**
 * Phase 9 — HITL: Receives a hitl_request from the AI layer and relays it
 * to all connected frontend clients via Socket.IO.
 */
export const postHITLRequest = async (req: Request, res: Response) => {
  const { regulationId, threadId, legalRisk, recommendedAction, rationale } = req.body;

  if (!regulationId || !threadId) {
    return res.status(400).json({ error: "regulationId and threadId are required." });
  }

  // Relay HITL event to the frontend
  broadcastHITLRequest(regulationId, threadId, legalRisk, recommendedAction, rationale);

  // Mark the regulation as awaiting_approval in the DB (optional but useful for UI)
  try {
    await Regulation.findByIdAndUpdate(regulationId, {
      status: "AWAITING_APPROVAL" as any,
    });
  } catch (_err) {
    // Non-fatal — regulation ID from the AI may be a UUID, not a Mongo ObjectId
  }

  res.json({ success: true });
};

/**
 * Phase 9 — HITL: Called when a compliance manager approves a CRITICAL
 * regulation. Forwards the approval to the AI layer, which resumes the
 * paused LangGraph workflow and generates MAPs.
 */
export const approveWorkflow = async (req: Request, res: Response) => {
  const { regulationId, approved } = req.body;

  if (!regulationId) {
    return res.status(400).json({ error: "regulationId is required." });
  }

  if (!approved) {
    // Rejected — notify frontend and log
    broadcastWorkflowUpdate(regulationId, "workflow", "REJECTED_BY_HUMAN");
    return res.json({ status: "rejected", message: "Workflow rejected by compliance manager." });
  }

  try {
    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";

    // Resume the paused LangGraph workflow in the AI layer
    const aiResponse = await axios.post(
      `${aiUrl}/resume-workflow`,
      { regulation_id: regulationId },
      { timeout: 300000 } // 5 minutes — MAP generation can be slow
    );

    // If maps were returned, persist them in the backend
    const { maps } = aiResponse.data;
    if (maps && maps.maps) {
      const { default: MAP, MapStatus, MapDepartment } = await import("../models/map.model.js");
      for (const m of maps.maps) {
        let assignedTo = "Compliance";
        if (m.assignedTo) {
          const norm = m.assignedTo.toLowerCase().trim().replace(/[^a-z]/g, "");
          if (norm === "itsecurity" || norm === "it" || norm === "security") {
            assignedTo = "IT Security";
          } else if (norm === "risk") {
            assignedTo = "Risk";
          } else if (norm === "legal") {
            assignedTo = "Legal";
          } else if (norm === "compliance") {
            assignedTo = "Compliance";
          } else if (norm === "finance") {
            assignedTo = "Finance";
          }
        }

        const actionRequired = m.actionRequired || m.action_required || m.description || "Review Regulatory Requirement";
        const description = m.description || m.actionRequired || m.action_required || "Review Regulatory Requirement";
        const parsedDate = m.deadline ? new Date(m.deadline) : null;
        const deadline = (parsedDate && !isNaN(parsedDate.getTime())) ? parsedDate : new Date(Date.now() + 48 * 3600 * 1000);

        const createdMap = await MAP.create({
          regulationId, // Note: may be a UUID from HITL path — handled gracefully
          description,
          assignedTo,
          actionRequired,
          status: MapStatus.OPEN,
          deadline
        });

        const { default: Audit } = await import("../models/audit.model.js");
        await Audit.create({
          mapId: createdMap._id,
          regulationId,
          action: "CREATED",
          newStatus: MapStatus.OPEN
        });
      }
    }

    broadcastWorkflowUpdate(regulationId, "workflow", "APPROVED_AND_COMPLETED");
    res.json({ status: "approved", maps: aiResponse.data.maps });
  } catch (error: any) {
    console.error("[approveWorkflow] Failed to resume AI workflow:", error?.message);
    res.status(500).json({ error: "Failed to resume workflow in AI layer." });
  }
};
