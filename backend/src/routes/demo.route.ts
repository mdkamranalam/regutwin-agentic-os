import { Router } from "express";
import { seedDemo, resetDemo } from "../controllers/demo.controller.js";

const router = Router();

// Demo routes (still require auth to prevent abuse)
router.post("/seed", seedDemo);
router.delete("/reset", resetDemo);

export default router;
