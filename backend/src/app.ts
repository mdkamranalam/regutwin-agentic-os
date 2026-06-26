import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS — restrict to frontend origin in production
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ─── Rate Limiting ──────────────────────────────────────────────────────────

// General API rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again in 15 minutes." },
  skip: (req) => {
    // Skip rate limiting for internal service calls
    const internalSecret = req.headers["x-internal-secret"];
    return internalSecret === (process.env.INTERNAL_SECRET || "regutwin_internal_secret_2026");
  },
});

// Stricter limit for AI-heavy endpoints (regulation ingestion, workflow)
const aiWorkflowLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many AI workflow requests. Please wait 5 minutes." },
});

app.use(generalLimiter);
app.use("/api/v1/regulations", aiWorkflowLimiter);

// ─── Body Parsing ────────────────────────────────────────────────────────────

app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use("/api/v1", routes);

// ─── Error Handling ───────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

export default app;
