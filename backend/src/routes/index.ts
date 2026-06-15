import { Router } from "express";
import healthRoutes from "./health.route.js";
import authRoutes from "./auth.route.js";
import regulationRoutes from "./regulation.route.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/regulations", regulationRoutes);

export default router;
