import { Router } from "express";
import { exportCompliancePDF, exportComplianceCSV } from "../controllers/reports.controller.js";

const router = Router();

router.get("/compliance-pdf", exportCompliancePDF);
router.get("/compliance-csv", exportComplianceCSV);

export default router;
