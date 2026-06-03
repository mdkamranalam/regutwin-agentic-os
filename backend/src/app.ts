import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ReguTwin Agentic OS Backend is running!");
});

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ReguTwin Agentic OS Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

export default app;
