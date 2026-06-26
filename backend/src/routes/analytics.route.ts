import { Router } from "express";
import {
  getComplianceHealth,
  getUpcomingDeadlines,
  getTrends,
} from "../controllers/analytics.controller.js";

const router = Router();

router.get("/health", getComplianceHealth);
router.get("/upcoming-deadlines", getUpcomingDeadlines);
router.get("/trends", getTrends);

export default router;
