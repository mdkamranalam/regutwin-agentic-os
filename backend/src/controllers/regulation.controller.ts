import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import axios from "axios";

import Regulation from "../models/regulation.model.js";
import { PDFService } from "../services/pdf.service.js";
import MAP, { MapStatus, MapDepartment, MapPriority, ValidationMethod } from "../models/map.model.js";
import Audit from "../models/audit.model.js";

// ─── Shared MAP Normalization Helper ──────────────────────────────────────────

function normalizeDepartment(raw: string | undefined): string {
  if (!raw) return "Compliance";
  const norm = raw.toLowerCase().trim().replace(/[^a-z\s]/g, "");
  if (norm.includes("it") || norm.includes("security") || norm.includes("tech")) return "IT Security";
  if (norm.includes("risk")) return "Risk";
  if (norm.includes("legal")) return "Legal";
  if (norm.includes("compliance")) return "Compliance";
  if (norm.includes("finance") || norm.includes("financial")) return "Finance";
  return "Compliance";
}

function normalizePriority(raw: string | undefined): string {
  if (!raw) return MapPriority.MEDIUM;
  const p = raw.toLowerCase();
  if (p.includes("critical")) return MapPriority.CRITICAL;
  if (p.includes("high")) return MapPriority.HIGH;
  if (p.includes("low")) return MapPriority.LOW;
  return MapPriority.MEDIUM;
}

function normalizeValidationMethod(raw: string | undefined): string {
  if (!raw) return ValidationMethod.EVIDENCE_REVIEW;
  const v = raw.toUpperCase().replace(/[^A-Z_]/g, "");
  if (Object.values(ValidationMethod).includes(v as ValidationMethod)) return v;
  return ValidationMethod.EVIDENCE_REVIEW;
}

function parseDeadline(raw: string | undefined, defaultHours: number = 72): Date {
  if (!raw) return new Date(Date.now() + defaultHours * 3600 * 1000);
  const parsed = new Date(raw);
  return !isNaN(parsed.getTime()) ? parsed : new Date(Date.now() + defaultHours * 3600 * 1000);
}

async function persistMapsFromWorkflow(
  workflowResult: any,
  regulationId: string,
) {
  if (!workflowResult?.maps?.maps) return;

  for (const m of workflowResult.maps.maps) {
    const assignedTo = normalizeDepartment(m.assignedTo);
    const actionRequired = m.actionRequired || m.action_required || m.description || "Review Regulatory Requirement";
    const description = m.description || actionRequired;
    const deadline = parseDeadline(m.deadline);
    const priority = normalizePriority(m.priority);
    const riskLevel = normalizePriority(m.risk_level || m.riskLevel || m.priority);
    const acceptanceCriteria = m.acceptance_criteria || m.acceptanceCriteria || "Task must be completed and evidence submitted.";
    const validationMethod = normalizeValidationMethod(m.validation_method || m.validationMethod);
    const successThreshold = m.success_threshold || m.successThreshold || "100% completion required.";
    const evidenceRequired = m.evidence_required || m.evidenceRequired || "Documented proof of implementation must be submitted.";

    const createdMap = await MAP.create({
      regulationId,
      description,
      assignedTo,
      actionRequired,
      status: MapStatus.OPEN,
      priority,
      riskLevel,
      deadline,
      acceptanceCriteria,
      validationMethod,
      successThreshold,
      evidenceRequired,
    });

    await Audit.create({
      mapId: createdMap._id,
      regulationId,
      action: "CREATED",
      newStatus: MapStatus.OPEN,
    });
  }
}

// ─── Upload PDF Regulation ────────────────────────────────────────────────────

export const uploadRegulation = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "PDF required" });
  }

  const extractedText = await PDFService.extractText(req.file.path);

  let regulation = await Regulation.create({
    title: req.body.title,
    source: req.body.source,
    filePath: req.file.path,
    extractedText,
  });

  try {
    const { AIService } = await import("../services/ai.service.js");
    const workflowResult = await AIService.runWorkflow(
      regulation.id,
      extractedText,
      regulation.title,
      regulation.source
    );

    regulation.analysis = workflowResult.analysis;

    if (workflowResult.conflicts?.conflicts) {
      regulation.conflicts = workflowResult.conflicts.conflicts.map((c: any) => ({
        regulationId: c.conflicting_regulation_id,
        title: c.conflicting_title,
        explanation: c.explanation,
      }));
    }

    regulation.status = "ANALYZED" as any;
    await regulation.save();

    await persistMapsFromWorkflow(workflowResult, regulation.id);
  } catch (error) {
    console.error("[uploadRegulation] AI Analysis failed:", error);
    regulation.status = "FAILED" as any;
    await regulation.save();
  }

  res.status(201).json(regulation);
};

// ─── Ingest Regulation from URL / Scraper ─────────────────────────────────────

export const ingestRegulationUrl = async (req: Request, res: Response) => {
  const { url, source, title, extractedText: rawText } = req.body;

  if (!source || !title) {
    return res.status(400).json({ message: "source and title are required" });
  }

  let filePath = url || "direct_text_paste.txt";
  let extractedText = rawText || "";

  // If no text provided, try to download and extract from URL
  if (!extractedText && url) {
    try {
      const uploadDir = path.resolve(process.cwd(), "src/uploads/regulations");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const safeFilename = `scraped_${Date.now()}.pdf`;
      filePath = path.join(uploadDir, safeFilename);

      try {
        const response = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });
        fs.writeFileSync(filePath, Buffer.from(response.data));
        extractedText = await PDFService.extractText(filePath);
      } catch (_downloadErr) {
        // If PDF download fails, use the title as minimal content
        // (real text should be provided by the scraper already)
        fs.writeFileSync(filePath, Buffer.from(`Regulatory Document: ${title}`));
        extractedText = `${title}\n\nSource: ${source}\nURL: ${url || "Not provided"}\n\nThis regulatory document requires review and compliance action as mandated by ${source}.`;
      }
    } catch (err) {
      extractedText = `${title}\n\nSource: ${source}`;
      filePath = "url_ingested.txt";
    }
  }

  let regulation = await Regulation.create({
    title,
    source,
    filePath,
    extractedText,
  });

  try {
    const { AIService } = await import("../services/ai.service.js");
    const workflowResult = await AIService.runWorkflow(
      regulation.id,
      extractedText,
      regulation.title,
      regulation.source
    );

    regulation.analysis = workflowResult.analysis;

    if (workflowResult.conflicts?.conflicts) {
      regulation.conflicts = workflowResult.conflicts.conflicts.map((c: any) => ({
        regulationId: c.conflicting_regulation_id,
        title: c.conflicting_title,
        explanation: c.explanation,
      }));
    }

    regulation.status = "ANALYZED" as any;
    await regulation.save();

    await persistMapsFromWorkflow(workflowResult, regulation.id);
  } catch (error) {
    console.error("[ingestRegulationUrl] AI Analysis failed:", error);
    regulation.status = "FAILED" as any;
    await regulation.save();
  }

  res.status(201).json(regulation);
};

// ─── Read Endpoints ───────────────────────────────────────────────────────────

export const getRegulations = async (req: Request, res: Response) => {
  const regulations = await Regulation.find().sort({ createdAt: -1 });
  res.json(regulations);
};

export const getRegulation = async (req: Request, res: Response) => {
  const regulation = await Regulation.findById(req.params.id);
  res.json(regulation);
};
