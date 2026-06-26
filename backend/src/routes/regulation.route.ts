import { Router } from "express";

import {
  uploadRegulation,
  ingestRegulationUrl,
  getRegulations,
  getRegulation,
} from "../controllers/regulation.controller.js";

import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/upload", upload.single("pdf"), uploadRegulation);
router.post("/ingest-url", ingestRegulationUrl);
router.get("/", getRegulations);
router.get("/:id", getRegulation);

export default router;
