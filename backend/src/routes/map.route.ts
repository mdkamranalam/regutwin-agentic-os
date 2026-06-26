import { Router } from "express";

import {
  createMap,
  getMaps,
  getMap,
  updateMapStatus,
  updateMap,
  deleteMap,
  validateMap,
} from "../controllers/map.controller.js";

import { scopeByDepartment } from "../middleware/role.middleware.js";
import { uploadEvidence } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/", createMap);
router.get("/", scopeByDepartment, getMaps);
router.get("/:id", getMap);
router.patch("/:id/status", updateMapStatus);
router.post("/:id/validate", uploadEvidence.single("evidenceFile"), validateMap);
router.put("/:id", updateMap);
router.delete("/:id", deleteMap);

export default router;
