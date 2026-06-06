import { Router } from "express";

const router = Router();

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