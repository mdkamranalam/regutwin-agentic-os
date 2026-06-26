import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  const internalSecret = req.headers["x-internal-secret"];
  if (internalSecret && internalSecret === (process.env.INTERNAL_SECRET || "regutwin_secret_key")) {
    req.user = { id: "system", role: "system" };
    return next();
  }

  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({
      message: "Unauthorized",
    });

  const token = header.split(" ")[1];

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
