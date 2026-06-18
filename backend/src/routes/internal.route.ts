import { Router } from "express";
import { saveAnalysis, postWorkflowUpdate } from "../controllers/internal.controller.js";

const router = Router();

router.post("/analysis", saveAnalysis);
router.post("/workflow-update", postWorkflowUpdate);

export default router;
