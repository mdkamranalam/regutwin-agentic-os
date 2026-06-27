import { Request, Response } from "express";
import MAP, { MapStatus, MapPriority, ValidationMethod } from "../models/map.model.js";
import Regulation from "../models/regulation.model.js";
import Audit from "../models/audit.model.js";

const IS_DEMO = process.env.DEMO_MODE === "true";

// ─── Internal helpers (mirrors regulation.controller.ts logic) ────────────────

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

async function persistMapsFromWorkflow(workflowResult: any, regulationId: string) {
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

/**
 * Directly ingests regulation text in-process (no HTTP round-trip to localhost).
 * This is the same logic as ingestRegulationUrl in regulation.controller.ts,
 * but called as a function to avoid Docker loopback issues.
 */
async function ingestRegulationText(title: string, source: string, extractedText: string) {
  let regulation = await Regulation.create({
    title,
    source,
    filePath: "demo_seeded.txt",
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
    console.error("[Demo] AI Analysis failed, saving regulation as FAILED:", error);
    regulation.status = "FAILED" as any;
    await regulation.save();
  }

  return regulation;
}

/**
 * POST /demo/seed
 * Seeds the database with 3 realistic regulations that create conflicts
 * and trigger the full AI pipeline. Works on a fresh machine and in Docker.
 */
export const seedDemo = async (req: Request, res: Response) => {
  if (!IS_DEMO) {
    return res.status(403).json({ error: "Demo mode is not enabled. Set DEMO_MODE=true in backend .env." });
  }

  try {
    // Check if already seeded
    const existing = await Regulation.countDocuments({
      source: { $in: ["Reserve Bank of India — Demo", "Securities and Exchange Board of India — Demo", "Internal Compliance Policy — Demo"] }
    });
    if (existing > 0) {
      return res.json({ message: "Demo data already seeded.", count: existing });
    }

    const demoRegulations = getDemoRegulations();
    const results = [];

    for (const reg of demoRegulations) {
      try {
        console.log(`[Demo] Seeding regulation: ${reg.title}`);
        // Direct in-process call — no localhost network hop, works in Docker
        const result = await ingestRegulationText(reg.title, reg.source, reg.text);
        results.push({ title: reg.title, status: "seeded", id: result._id });
      } catch (err: any) {
        console.error(`[Demo] Failed to seed ${reg.title}:`, err.message);
        results.push({ title: reg.title, status: "failed", error: err.message });
      }
    }

    res.json({
      message: "Demo seeding complete.",
      results,
      instructions: [
        "Navigate to the Dashboard to see compliance scores update.",
        "Navigate to Regulations Library to see 3 new regulations.",
        "Navigate to MAP Tasks to see AI-generated measurable action points.",
        "Navigate to Conflicts to see the RBI vs SEBI conflict detection.",
        "Navigate to Audit Trail to see the cryptographic evidence vault.",
      ],
    });
  } catch (error: any) {
    console.error("[Demo] Seed failed:", error.message);
    res.status(500).json({ error: "Demo seeding failed.", details: error.message });
  }
};

/**
 * DELETE /demo/reset
 * Removes all demo data from the database.
 */
export const resetDemo = async (req: Request, res: Response) => {
  if (!IS_DEMO) {
    return res.status(403).json({ error: "Demo mode is not enabled." });
  }

  const demoSources = [
    "Reserve Bank of India — Demo",
    "Securities and Exchange Board of India — Demo",
    "Internal Compliance Policy — Demo",
  ];

  const demoRegs = await Regulation.find({ source: { $in: demoSources } });
  const demoRegIds = demoRegs.map((r) => r._id);

  const mapDeletions = await MAP.deleteMany({ regulationId: { $in: demoRegIds } });
  const regDeletions = await Regulation.deleteMany({ source: { $in: demoSources } });

  res.json({
    message: "Demo data reset complete.",
    regulationsDeleted: regDeletions.deletedCount,
    mapsDeleted: mapDeletions.deletedCount,
  });
};

// ─── Demo Regulation Content ──────────────────────────────────────────────────

function getDemoRegulations() {
  return [
    {
      title: "RBI/2026/47 — KYC & Session Security Guidelines for Digital Banking Platforms",
      source: "Reserve Bank of India — Demo",
      text: `
RBI/2026/47

Reserve Bank of India
Department of Banking Regulation

KYC & Session Security Guidelines for Digital Banking Platforms

CIRCULAR

Date: June 2026

To: All Scheduled Commercial Banks, Payment Banks, and Small Finance Banks

Subject: Mandatory Session Timeout and Multi-Factor Authentication Requirements for Digital Banking Channels

1. BACKGROUND

The Reserve Bank of India has observed increasing instances of unauthorized account access through abandoned browser sessions in digital banking platforms. To safeguard customer interests and ensure data integrity, the following mandatory technical requirements are hereby issued under Section 35A of the Banking Regulation Act, 1949.

2. SESSION TIMEOUT REQUIREMENTS

2.1 All internet banking and mobile banking platforms MUST enforce a mandatory session timeout of exactly 30 (thirty) seconds of inactivity for KYC verification workflows.

2.2 For standard banking sessions (non-KYC), the maximum session idle timeout SHALL NOT exceed 15 (fifteen) minutes.

2.3 Session timeout MUST be implemented at the server side. Client-side timeouts alone are insufficient and will constitute non-compliance.

2.4 Upon timeout, all session tokens MUST be invalidated immediately. The user MUST re-authenticate using full credentials.

3. MULTI-FACTOR AUTHENTICATION

3.1 All transactions above INR 10,000 MUST require multi-factor authentication (MFA).

3.2 Acceptable MFA factors: OTP via registered mobile, biometric verification, or hardware token.

3.3 MFA bypass mechanisms are strictly prohibited.

4. KYC DOCUMENTATION STANDARDS

4.1 All banks MUST maintain digital KYC records for a minimum of 10 years.

4.2 KYC records MUST be encrypted using AES-256 encryption at rest.

4.3 KYC verification MUST be completed within 7 days of customer onboarding.

5. AUDIT AND REPORTING

5.1 Banks MUST maintain tamper-proof audit logs of all session activities.

5.2 Non-compliance will attract penalties under the Payment and Settlement Systems Act, 2007.

6. TIMELINE

All banks MUST achieve full compliance within 30 days of this circular's issuance date.

Signed,
Deputy Governor
Reserve Bank of India
`,
    },
    {
      title: "SEBI/HO/CDMRD/2026/23 — Cyber Security Framework for Digital Trading Platforms",
      source: "Securities and Exchange Board of India — Demo",
      text: `
SEBI/HO/CDMRD/2026/23

Securities and Exchange Board of India

CIRCULAR

Date: June 2026

To: All Stock Brokers, Depository Participants, and Recognized Stock Exchanges

Subject: Enhanced Cyber Security Framework and Session Management Requirements for Digital Trading Platforms

1. INTRODUCTION

In the interest of investor protection and the integrity of securities markets, SEBI hereby mandates the following cybersecurity standards for all online trading platforms under SEBI's jurisdiction.

2. SESSION MANAGEMENT REQUIREMENTS

2.1 Digital trading platforms MUST enforce a minimum session inactivity timeout of 60 (sixty) seconds for trading-related workflows to prevent unintended order cancellations due to premature session termination.

2.2 For portfolio review and research modules, session timeouts SHALL be configurable by the user within a range of 5 to 30 minutes.

2.3 Session management MUST comply with OWASP ASVS Level 2 standards as a minimum baseline.

3. ENCRYPTION STANDARDS

3.1 All data in transit MUST be encrypted using TLS 1.3 or higher.

3.2 Data at rest MUST use AES-256-GCM encryption.

3.3 Certificate pinning MUST be implemented in all mobile trading applications.

4. VULNERABILITY ASSESSMENT

4.1 All trading platforms MUST undergo mandatory VAPT (Vulnerability Assessment and Penetration Testing) every 6 months.

4.2 Critical vulnerabilities MUST be remediated within 72 hours of discovery.

4.3 High severity vulnerabilities MUST be remediated within 7 days.

5. INCIDENT RESPONSE

5.1 Cybersecurity incidents MUST be reported to SEBI within 6 hours of detection.

5.2 A post-incident analysis report MUST be submitted to SEBI within 5 business days.

5.3 Trading platforms MUST have a documented and tested Business Continuity Plan (BCP).

6. COMPLIANCE TIMELINE

All entities MUST achieve full compliance within 60 days of this circular's issuance.

Signed,
Executive Director
Securities and Exchange Board of India
`,
    },
    {
      title: "Internal Policy: GBIC/IT-SEC/2026/001 — Enterprise Digital Security Standards",
      source: "Internal Compliance Policy — Demo",
      text: `
GLOBAL BANK INDIA — INTERNAL POLICY

Reference: GBIC/IT-SEC/2026/001

Enterprise Digital Security and Authentication Standards

Issued by: IT Security Department
Approval: Board Risk Committee

Date: June 2026

1. SESSION MANAGEMENT POLICY

1.1 Standard internet banking sessions MUST timeout after exactly 10 (ten) minutes of inactivity to balance security and user experience.

1.2 KYC verification modules MUST NOT timeout before 2 (two) minutes to allow customers adequate time to upload required documents.

1.3 Mobile banking applications MAY use biometric re-authentication as an alternative to full session termination.

2. PASSWORD AND AUTHENTICATION POLICY

2.1 All user passwords MUST have a minimum length of 12 characters.

2.2 Passwords MUST contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.

2.3 Password expiry is set at 90 days for all banking staff.

3. ENCRYPTION POLICY

3.1 Internal databases MUST use AES-128 encryption (minimum) for data at rest.

3.2 All inter-service communication MUST use TLS 1.2 or higher.

4. ACCESS CONTROL POLICY

4.1 Role-based access control (RBAC) MUST be implemented for all banking systems.

4.2 Privileged access MUST require PAM (Privileged Access Management) approval.

4.3 Access reviews MUST be conducted quarterly.

5. INCIDENT MANAGEMENT

5.1 All security incidents MUST be escalated to the CISO within 2 hours.

5.2 Customer-impacting incidents MUST be reported to RBI within 6 hours.

Approved by: Chief Information Security Officer
`,
    },
  ];
}
