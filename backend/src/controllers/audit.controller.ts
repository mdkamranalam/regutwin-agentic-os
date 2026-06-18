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
