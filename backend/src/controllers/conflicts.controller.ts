import { Request, Response } from "express";
import Regulation from "../models/regulation.model.js";
import MAP from "../models/map.model.js";

/**
 * GET /conflicts
 * Returns all regulations that have detected conflicts, with full conflict details.
 */
export const getAllConflicts = async (req: Request, res: Response) => {
  try {
    const regulations = await Regulation.find({
      "conflicts.0": { $exists: true }, // Only regulations with at least one conflict
    }).sort({ createdAt: -1 });

    const result = regulations.map((reg) => ({
      regulationId: reg._id,
      regulationTitle: reg.title,
      source: reg.source,
      riskLevel: reg.analysis?.riskLevel || "Medium",
      detectedAt: (reg as any).updatedAt,
      conflicts: (reg.conflicts || []).map((c) => ({
        conflictingRegulationId: c.regulationId,
        conflictingTitle: c.title,
        explanation: c.explanation,
        severity: deriveSeverity(c.explanation),
        recommendation: generateRecommendation(c.explanation),
      })),
    }));

    res.json(result);
  } catch (error) {
    console.error("[conflicts] Failed to fetch conflicts:", error);
    res.status(500).json({ error: "Failed to fetch conflicts" });
  }
};

/**
 * GET /conflicts/stats
 * Returns conflict statistics for the dashboard KPI.
 */
export const getConflictStats = async (req: Request, res: Response) => {
  try {
    const regulations = await Regulation.find({
      "conflicts.0": { $exists: true },
    });

    let critical = 0;
    let high = 0;
    let medium = 0;
    let total = 0;

    for (const reg of regulations) {
      for (const c of reg.conflicts || []) {
        const sev = deriveSeverity(c.explanation);
        total++;
        if (sev === "Critical") critical++;
        else if (sev === "High") high++;
        else medium++;
      }
    }

    res.json({
      total,
      critical,
      high,
      medium,
      regulationsAffected: regulations.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conflict stats" });
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveSeverity(explanation: string): "Critical" | "High" | "Medium" {
  const lower = (explanation || "").toLowerCase();
  if (
    lower.includes("contradict") ||
    lower.includes("directly conflict") ||
    lower.includes("violation") ||
    lower.includes("incompatible") ||
    lower.includes("mutual exclusive")
  ) {
    return "Critical";
  }
  if (
    lower.includes("conflict") ||
    lower.includes("inconsistent") ||
    lower.includes("differs") ||
    lower.includes("discrepancy")
  ) {
    return "High";
  }
  return "Medium";
}

function generateRecommendation(explanation: string): string {
  const lower = (explanation || "").toLowerCase();
  if (lower.includes("timeout") || lower.includes("session")) {
    return "Convene a cross-regulatory working group to agree on a uniform session timeout standard. Apply the stricter requirement pending resolution.";
  }
  if (lower.includes("encryption") || lower.includes("cipher")) {
    return "Apply the strongest encryption standard from the conflicting requirements until a unified policy is formally adopted.";
  }
  if (lower.includes("capital") || lower.includes("reserve")) {
    return "Consult RBI and SEBI jointly to determine the applicable capital adequacy requirement for the regulated entity's specific license category.";
  }
  if (lower.includes("kyc") || lower.includes("identity")) {
    return "Perform a gap analysis between conflicting KYC requirements and escalate to the Legal department for regulatory interpretation opinion.";
  }
  return "Escalate to the Legal and Compliance departments for cross-regulatory interpretation and prepare a formal conflict resolution memo.";
}
