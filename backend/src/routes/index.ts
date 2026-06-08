import { Router } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

router.get("/health", (req, res) => {
  res
    .status(200)
    .json({
      status: "ok",
      success: true,
      message: "ReguTwin Agentic OS Backend is running!",
      timestamp: new Date().toISOString(),
    });
});

export default router;
