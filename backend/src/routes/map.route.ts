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

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Define routes
router.post("/", authenticate, createMap);
router.get("/", authenticate, getMaps);
router.get("/:id", authenticate, getMap);
router.patch("/:id/status", authenticate, updateMapStatus);
router.post("/:id/validate", authenticate, validateMap);
router.put("/:id", authenticate, updateMap);
router.delete("/:id", authenticate, deleteMap);

export default router;
