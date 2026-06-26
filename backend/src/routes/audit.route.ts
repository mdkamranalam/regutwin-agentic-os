import { Router } from "express";
import { getAudits, verifyEvidence } from "../controllers/audit.controller.js";

const router = Router();

router.get("/", getAudits);
router.post("/verify", verifyEvidence);

export default router;
