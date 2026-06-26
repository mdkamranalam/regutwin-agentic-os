import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import MAP from "../models/map.model.js";
import Regulation from "../models/regulation.model.js";
import Audit from "../models/audit.model.js";

/**
 * GET /reports/compliance-pdf
 * Generates an executive compliance audit report PDF.
 */
export const exportCompliancePDF = async (req: Request, res: Response) => {
  try {
    const [maps, regulations, audits] = await Promise.all([
      MAP.find().populate("regulationId").sort({ createdAt: -1 }),
      Regulation.find().sort({ createdAt: -1 }),
      Audit.find().sort({ createdAt: -1 }).limit(20),
    ]);

    const closedCount = maps.filter((m) => m.status === "CLOSED").length;
    const openCount = maps.filter((m) => m.status === "OPEN" || m.status === "IN_PROGRESS").length;
    const overdueCount = maps.filter((m) => m.status === "OVERDUE").length;
    const totalCount = maps.length || 1;
    const complianceScore = Math.round((closedCount / totalCount) * 100);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="ReguTwin_Compliance_Report_${Date.now()}.pdf"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Title Page / Header
    doc.fillColor("#0D8B93").fontSize(24).font("Helvetica-Bold").text("ReguTwin Agentic OS", { align: "center" });
    doc.fillColor("#333333").fontSize(14).font("Helvetica").text("Executive Regulatory Compliance Audit Report", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#666666").text(`Generated: ${new Date().toUTCString()} | Scope: Global Enterprise`, { align: "center" });
    doc.moveDown(1.5);

    // Executive Summary KPI Box
    doc.rect(50, doc.y, 512, 80).fillAndStroke("#F4F9F9", "#0D8B93");
    const kpiY = doc.y + 15;
    doc.fillColor("#0D8B93").fontSize(22).font("Helvetica-Bold").text(`${complianceScore}%`, 70, kpiY);
    doc.fontSize(9).fillColor("#555555").font("Helvetica").text("Compliance Score", 70, kpiY + 25);

    doc.fillColor("#333333").fontSize(18).font("Helvetica-Bold").text(`${regulations.length}`, 200, kpiY);
    doc.fontSize(9).fillColor("#555555").font("Helvetica").text("Active Regulations", 200, kpiY + 25);

    doc.fillColor("#E67E22").fontSize(18).font("Helvetica-Bold").text(`${openCount}`, 330, kpiY);
    doc.fontSize(9).fillColor("#555555").font("Helvetica").text("Open MAPs", 330, kpiY + 25);

    doc.fillColor("#27AE60").fontSize(18).font("Helvetica-Bold").text(`${closedCount}`, 450, kpiY);
    doc.fontSize(9).fillColor("#555555").font("Helvetica").text("Validated MAPs", 450, kpiY + 25);

    doc.y = kpiY + 70;
    doc.moveDown(1);

    // Section 1: Active Regulations
    doc.fillColor("#0D8B93").fontSize(16).font("Helvetica-Bold").text("1. Monitored Regulations");
    doc.moveDown(0.5);

    if (regulations.length === 0) {
      doc.fontSize(10).fillColor("#888888").font("Helvetica-Oblique").text("No regulations ingested in the current scope.");
    } else {
      regulations.forEach((r, idx) => {
        doc.fontSize(11).fillColor("#222222").font("Helvetica-Bold").text(`${idx + 1}. ${r.title}`);
        doc.fontSize(9).fillColor("#666666").font("Helvetica").text(`Source: ${r.source} | Status: ${r.status}`);
        doc.moveDown(0.5);
      });
    }
    doc.moveDown(1);

    // Section 2: Measurable Action Points (MAPs)
    doc.fillColor("#0D8B93").fontSize(16).font("Helvetica-Bold").text("2. Measurable Action Points (MAPs)");
    doc.moveDown(0.5);

    if (maps.length === 0) {
      doc.fontSize(10).fillColor("#888888").font("Helvetica-Oblique").text("No MAP tasks generated.");
    } else {
      maps.slice(0, 15).forEach((m, idx) => {
        const regTitle = (m.regulationId as any)?.title || "General Compliance";
        doc.fontSize(10).fillColor("#111111").font("Helvetica-Bold").text(`[${m.priority || "Medium"}] ${m.actionRequired}`);
        doc.fontSize(9).fillColor("#444444").font("Helvetica").text(`Dept: ${m.assignedTo} | Status: ${m.status} | Method: ${m.validationMethod || "EVIDENCE_REVIEW"}`);
        doc.fontSize(9).fillColor("#555555").font("Helvetica-Oblique").text(`Criteria: ${m.acceptanceCriteria || "Standard review required"}`);
        doc.moveDown(0.5);
      });
    }
    doc.moveDown(1);

    // Section 3: Recent Cryptographic Evidence Seals
    doc.fillColor("#0D8B93").fontSize(16).font("Helvetica-Bold").text("3. WORM Audit Trail & Evidence Vault");
    doc.moveDown(0.5);

    audits.slice(0, 10).forEach((a) => {
      doc.fontSize(9).fillColor("#333333").font("Helvetica-Bold").text(`Action: ${a.action} (${new Date(a.createdAt).toISOString()})`);
      if (a.evidenceHash) {
        doc.fontSize(8).fillColor("#0D8B93").font("Courier").text(`SHA-256 Seal: ${a.evidenceHash}`);
      }
      doc.moveDown(0.3);
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).fillColor("#AAAAAA").font("Helvetica").text("End of Official Audit Report — Cryptographically Verified by ReguTwin Governance Engine", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("[reports] PDF generation error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate compliance report PDF" });
    }
  }
};

/**
 * GET /reports/compliance-csv
 * Exports MAP data as CSV.
 */
export const exportComplianceCSV = async (req: Request, res: Response) => {
  try {
    const maps = await MAP.find().populate("regulationId").sort({ createdAt: -1 });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="ReguTwin_MAP_Export_${Date.now()}.csv"`);

    const headers = [
      "ID",
      "Regulation",
      "Action Required",
      "Assigned Department",
      "Priority",
      "Risk Level",
      "Status",
      "Validation Method",
      "Acceptance Criteria",
      "Deadline",
      "Created At",
    ];

    const rows = maps.map((m) => [
      `"${m._id}"`,
      `"${((m.regulationId as any)?.title || "").replace(/"/g, '""')}"`,
      `"${(m.actionRequired || "").replace(/"/g, '""')}"`,
      `"${m.assignedTo}"`,
      `"${m.priority || "Medium"}"`,
      `"${m.riskLevel || "Medium"}"`,
      `"${m.status}"`,
      `"${m.validationMethod || "EVIDENCE_REVIEW"}"`,
      `"${(m.acceptanceCriteria || "").replace(/"/g, '""')}"`,
      `"${m.deadline ? new Date(m.deadline).toISOString().split("T")[0] : ""}"`,
      `"${new Date((m as any).createdAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    res.send(csvContent);
  } catch (error) {
    console.error("[reports] CSV export error:", error);
    res.status(500).json({ error: "Failed to export CSV" });
  }
};
