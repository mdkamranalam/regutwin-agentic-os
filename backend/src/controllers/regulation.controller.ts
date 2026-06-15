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

  const regulation = await Regulation.create({
    title: req.body.title,

    source: req.body.source,

    filePath: req.file.path,

    extractedText,
  });

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
