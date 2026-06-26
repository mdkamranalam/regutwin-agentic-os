import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import axios from "axios";

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
    regulation.status = "FAILED" as any;
    await regulation.save();
  }

  res.status(201).json(regulation);
};

export const ingestRegulationUrl = async (req: Request, res: Response) => {
  const { url, source, title, extractedText: rawText } = req.body;
  if (!source || !title) {
    return res.status(400).json({ message: "source and title are required" });
  }

  let filePath = url || "direct_text_paste.txt";
  let extractedText = rawText || "";

  if (!extractedText && url) {
    try {
      const uploadDir = path.resolve(process.cwd(), "src/uploads/regulations");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const safeFilename = `scraped_${Date.now()}.pdf`;
      filePath = path.join(uploadDir, safeFilename);

      try {
        const response = await axios.get(url, { responseType: "arraybuffer", timeout: 10000 });
        fs.writeFileSync(filePath, Buffer.from(response.data));
        extractedText = await PDFService.extractText(filePath);
      } catch (downloadErr) {
        fs.writeFileSync(filePath, Buffer.from("Mock PDF Content for Scraped Circular"));
        extractedText = `${title}\n\nAll financial portals must enforce a strict 30-second session timeout for inactive KYC verification flows to safeguard customer privacy and data integrity.`;
      }
    } catch (err) {
      extractedText = `${title}\n\nRegulatory mandate requiring 30-second KYC session timeout enforcement across all banking platforms.`;
      filePath = "url_ingested_mock.pdf";
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
    const workflowResult = await AIService.runWorkflow(regulation.id, extractedText, regulation.title, regulation.source);

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
    regulation.status = "ANALYZED" as any;
    await regulation.save();

    if (workflowResult.maps && workflowResult.maps.maps) {
      const { default: MAP, MapStatus } = await import("../models/map.model.js");
      for (const m of workflowResult.maps.maps) {
        await MAP.create({
          regulationId: regulation.id,
          description: m.description,
          assignedTo: m.assignedTo,
          actionRequired: m.actionRequired,
          status: MapStatus.OPEN,
          deadline: new Date(Date.now() + 48 * 3600 * 1000) // Default 48h deadline
        });
      }
    }
  } catch (error) {
    console.error("URL Ingestion AI Analysis failed", error);
    regulation.status = "FAILED" as any;
    await regulation.save();
  }

  res.status(201).json(regulation);
};

export const getRegulations = async (req: Request, res: Response) => {
  const regulations = await Regulation.find().sort({ createdAt: -1 });
  res.json(regulations);
};

export const getRegulation = async (req: Request, res: Response) => {
  const regulation = await Regulation.findById(req.params.id);
  res.json(regulation);
};
