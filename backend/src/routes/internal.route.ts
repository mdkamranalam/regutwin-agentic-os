import { Router } from "express";
import { saveAnalysis } from "../controllers/internal.controller.js";

const router = Router();

router.post("/analysis", saveAnalysis);

export default router;
