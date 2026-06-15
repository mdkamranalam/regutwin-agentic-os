import { Router } from "express";

import {
  uploadRegulation,
  getRegulations,
  getRegulation,
} from "../controllers/regulation.controller.js";

import { upload } from "../middleware/upload.middleware.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/upload", authenticate, upload.single("pdf"), uploadRegulation);

router.get("/", authenticate, getRegulations);

router.get("/:id", authenticate, getRegulation);

export default router;
