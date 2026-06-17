import { Request, Response } from "express";

import Regulation from "../models/regulation.model.js";

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

  res.json({
    success: true,
  });
};
