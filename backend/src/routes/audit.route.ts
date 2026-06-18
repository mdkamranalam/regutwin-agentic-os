import { Router } from "express";
import { getAudits } from "../controllers/audit.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getAudits);

export default router;
