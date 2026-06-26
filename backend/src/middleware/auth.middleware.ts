import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authenticate = (req: any, res: Response, next: NextFunction) => {
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
