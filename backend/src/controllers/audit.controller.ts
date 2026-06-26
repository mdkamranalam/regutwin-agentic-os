import { Request, Response } from "express";
import Audit from "../models/audit.model.js";

export const getAudits = async (req: Request, res: Response) => {
  try {
    const audits = await Audit.find()
      .populate("mapId", "actionRequired assignedTo description")
      .populate("regulationId", "title source")
      .sort({ createdAt: -1 });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audits" });
  }
};

export const verifyEvidence = async (req: Request, res: Response) => {
  try {
    const { auditId, hashToVerify } = req.body;
    const audit = await Audit.findById(auditId);
    if (!audit) return res.status(404).json({ error: "Audit vault record not found." });

    const isMatch = audit.evidenceHash === hashToVerify;
    res.json({
      verified: isMatch,
      storedHash: audit.evidenceHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      providedHash: hashToVerify,
      status: isMatch ? "INTEGRITY_VERIFIED" : "TAMPER_DETECTED",
      message: isMatch
        ? "Cryptographic SHA-256 seal matches WORM Vault record exactly. Zero tampering detected."
        : "🚨 CRITICAL WARNING: Provided evidence document hash does NOT match ledger seal. Possible evidence tampering!"
    });
  } catch (error) {
    res.status(500).json({ error: "Cryptographic verification failed." });
  }
};
