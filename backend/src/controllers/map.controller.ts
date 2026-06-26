import { Request, Response } from "express";
import fs from "fs";
import crypto from "crypto";
import MAP from "../models/map.model.js";
import Audit from "../models/audit.model.js";
import { AIService } from "../services/ai.service.js";

export const createMap = async (req: Request, res: Response) => {
  try {
    const map = await MAP.create(req.body);
    await Audit.create({
      mapId: map._id,
      regulationId: map.regulationId,
      action: "CREATED",
      newStatus: map.status,
    });
    res.status(201).json(map);
  } catch (error) {
    res.status(400).json({ error: "Failed to create MAP" });
  }
};

export const getMaps = async (req: Request, res: Response) => {
  try {
    const { department, regulationId } = req.query;
    const filter: any = { ...(req as any).departmentFilter };
    if (department && department !== "All") filter.assignedTo = department;
    if (regulationId) filter.regulationId = regulationId;

    const maps = await MAP.find(filter).populate("regulationId", "title source");
    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MAPs" });
  }
};

export const getMap = async (req: Request, res: Response) => {
  try {
    const map = await MAP.findById(req.params.id).populate("regulationId", "title source");
    if (!map) {
      return res.status(404).json({ error: "MAP not found" });
    }
    res.json(map);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MAP" });
  }
};

export const updateMapStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const oldMap = await MAP.findById(req.params.id);
    if (!oldMap) {
      return res.status(404).json({ error: "MAP not found" });
    }
    
    const previousStatus = oldMap.status;
    oldMap.status = status;
    await oldMap.save();

    await Audit.create({
      mapId: oldMap._id,
      regulationId: oldMap.regulationId,
      action: "STATUS_CHANGED",
      previousStatus,
      newStatus: status,
    });

    res.json(oldMap);
  } catch (error) {
    res.status(400).json({ error: "Failed to update MAP status" });
  }
};

export const updateMap = async (req: Request, res: Response) => {
  try {
    const oldMap = await MAP.findById(req.params.id);
    if (!oldMap) {
      return res.status(404).json({ error: "MAP not found" });
    }
    
    const map = await MAP.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await Audit.create({
      mapId: map!._id,
      regulationId: map!.regulationId,
      action: "UPDATED",
      previousStatus: oldMap.status,
      newStatus: map!.status,
    });

    res.json(map);
  } catch (error) {
    res.status(400).json({ error: "Failed to update MAP" });
  }
};

export const deleteMap = async (req: Request, res: Response) => {
  try {
    const map = await MAP.findByIdAndDelete(req.params.id);
    if (!map) {
      return res.status(404).json({ error: "MAP not found" });
    }
    res.json({ message: "MAP deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete MAP" });
  }
};

export const validateMap = async (req: any, res: Response) => {
  try {
    let { evidenceText } = req.body;
    let filePath = undefined;
    let hash = undefined;

    if (req.file) {
      filePath = req.file.path;
      const fileBuffer = fs.readFileSync(filePath);
      hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
      if (!evidenceText) evidenceText = `Cryptographic Vault Document: ${req.file.originalname}`;
    } else if (evidenceText) {
      hash = crypto.createHash("sha256").update(evidenceText).digest("hex");
    }

    const map = await MAP.findById(req.params.id);
    if (!map) {
      return res.status(404).json({ error: "MAP not found" });
    }

    const validationResult = await AIService.validateMap(
      map.actionRequired, 
      map.description, 
      evidenceText,
      map.targetApiEndpoint,
      map.testConfig
    );
    
    const previousStatus = map.status;
    if (validationResult.is_valid) {
      map.status = "CLOSED" as any;
      await map.save();
    } else {
      map.status = "OPEN" as any;
      await map.save();
      
      import("../services/notification.service.js").then(({ NotificationService }) => {
        NotificationService.sendAlert(
          map.assignedTo,
          "URGENT: MAP Validation Failed",
          `The MAP "${map.actionRequired}" failed autonomous compliance testing.\nFeedback: ${validationResult.feedback}`
        );
      });
    }

    const auditLog = await Audit.create({
      mapId: map._id,
      regulationId: map.regulationId,
      action: "VALIDATED",
      previousStatus,
      newStatus: map.status,
      evidenceText,
      evidenceHash: hash,
      evidenceFilePath: filePath,
      validationResult,
    });

    res.json({ map, validationResult, vaultHash: hash, auditId: auditLog._id });
  } catch (error) {
    res.status(500).json({ error: "Validation failed" });
  }
};
