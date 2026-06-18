import { Request, Response } from "express";

import Regulation from "../models/regulation.model.js";

import { PDFService } from "../services/pdf.service.js";

export const uploadRegulation = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      message: "PDF required",
    });
  }

  const extractedText = await PDFService.extractText(req.file.path);

  // 1. Create the regulation as NEW
  let regulation = await Regulation.create({
    title: req.body.title,
    source: req.body.source,
    filePath: req.file.path,
    extractedText,
  });

  try {
    // 2. Run the full LangGraph Workflow
    const { AIService } = await import("../services/ai.service.js");
    const workflowResult = await AIService.runWorkflow(regulation.id, extractedText, regulation.title, regulation.source);
    
    // 3. Extract results and save
    regulation.analysis = workflowResult.analysis;
    
    let conflicts = [];
    if (workflowResult.conflicts && workflowResult.conflicts.conflicts) {
      conflicts = workflowResult.conflicts.conflicts.map((c: any) => ({
        regulationId: c.conflicting_regulation_id,
        title: c.conflicting_title,
        explanation: c.explanation,
      }));
    }
    regulation.conflicts = conflicts;
    
    // 4. Update status and save
    regulation.status = "ANALYZED" as any;
    await regulation.save();
    
    // Create MAPs in the backend from the workflow result
    if (workflowResult.maps && workflowResult.maps.maps) {
      const { default: MAP, MapStatus } = await import("../models/map.model.js");
      for (const m of workflowResult.maps.maps) {
        await MAP.create({
          regulationId: regulation.id,
          description: m.description,
          assignedTo: m.assignedTo,
          actionRequired: m.actionRequired,
          status: MapStatus.OPEN
        });
      }
    }
  } catch (error) {
    console.error("AI Analysis failed", error);
    // Keep status as NEW if AI fails
  }

  res.status(201).json(regulation);
};

export const getRegulations = async (req: Request, res: Response) => {
  const regulations = await Regulation.find();

  res.json(regulations);
};

export const getRegulation = async (req: Request, res: Response) => {
  const regulation = await Regulation.findById(req.params.id);

  res.json(regulation);
};
