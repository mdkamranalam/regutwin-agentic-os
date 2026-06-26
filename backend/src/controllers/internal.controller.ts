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
      const { default: MAP, MapStatus, MapPriority, ValidationMethod } = await import("../models/map.model.js");
      const { default: Audit } = await import("../models/audit.model.js");

      for (const m of maps.maps) {
        // Normalize department
        const raw = (m.assignedTo || "").toLowerCase().trim().replace(/[^a-z\s]/g, "");
        let assignedTo = "Compliance";
        if (raw.includes("it") || raw.includes("security")) assignedTo = "IT Security";
        else if (raw.includes("risk")) assignedTo = "Risk";
        else if (raw.includes("legal")) assignedTo = "Legal";
        else if (raw.includes("finance")) assignedTo = "Finance";

        const actionRequired = m.actionRequired || m.action_required || m.description || "Review Regulatory Requirement";
        const description = m.description || actionRequired;
        const parsedDate = m.deadline ? new Date(m.deadline) : null;
        const deadline = (parsedDate && !isNaN(parsedDate.getTime())) ? parsedDate : new Date(Date.now() + 72 * 3600 * 1000);

        // Normalize priority
        const rawPriority = (m.priority || "").toLowerCase();
        const priority = rawPriority.includes("critical") ? MapPriority.CRITICAL
          : rawPriority.includes("high") ? MapPriority.HIGH
          : rawPriority.includes("low") ? MapPriority.LOW
          : MapPriority.MEDIUM;

        // Normalize validation method
        const rawMethod = (m.validation_method || m.validationMethod || "").toUpperCase().replace(/[^A-Z_]/g, "");
        const allMethods = Object.values(ValidationMethod) as string[];
        const validationMethod = allMethods.includes(rawMethod) ? rawMethod : ValidationMethod.EVIDENCE_REVIEW;

        const createdMap = await MAP.create({
          regulationId,
          description,
          assignedTo,
          actionRequired,
          status: MapStatus.OPEN,
          priority,
          riskLevel: priority,
          deadline,
          acceptanceCriteria: m.acceptance_criteria || m.acceptanceCriteria || "Task must be completed and evidence submitted.",
          validationMethod,
          successThreshold: m.success_threshold || m.successThreshold || "100% completion required.",
          evidenceRequired: m.evidence_required || m.evidenceRequired || "Documented proof of implementation must be submitted.",
        });

        await Audit.create({
          mapId: createdMap._id,
          regulationId,
          action: "CREATED",
          newStatus: MapStatus.OPEN,
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
