import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  // Allow internal service-to-service calls via shared secret
  const internalSecret = req.headers["x-internal-secret"];
  const expectedSecret = process.env.INTERNAL_SECRET;
  if (expectedSecret && internalSecret && internalSecret === expectedSecret) {
    req.user = { id: "system", role: "ADMIN" };
    return next();
  }

  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({
      message: "Unauthorized",
    });

  const token = header.split(" ")[1];

  // DEMO_MODE: Accept the mock token used by ProtectedRoute.tsx for seamless judge access
  if (process.env.DEMO_MODE === "true" && token === "demo_mock_jwt_token_2026") {
    req.user = { id: "demo_admin", role: "ADMIN", department: "All" };
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
