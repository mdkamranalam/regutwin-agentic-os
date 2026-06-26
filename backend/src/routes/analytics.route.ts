import { Router } from "express";
import {
  getComplianceHealth,
  getUpcomingDeadlines,
  getTrends,
  getRiskTrends,
  getSectorImpact,
  getRecentActivities,
} from "../controllers/analytics.controller.js";

const router = Router();

router.get("/health", getComplianceHealth);
router.get("/upcoming-deadlines", getUpcomingDeadlines);
router.get("/trends", getTrends);
router.get("/risk-trends", getRiskTrends);
router.get("/sector-impact", getSectorImpact);
router.get("/recent-activities", getRecentActivities);

export default router;
