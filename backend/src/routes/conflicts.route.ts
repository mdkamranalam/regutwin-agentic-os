import { Router } from "express";
import { getAllConflicts, getConflictStats } from "../controllers/conflicts.controller.js";

const router = Router();

router.get("/", getAllConflicts);
router.get("/stats", getConflictStats);

export default router;
