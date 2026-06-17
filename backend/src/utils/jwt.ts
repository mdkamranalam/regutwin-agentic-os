import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET!, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES as any,
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET!, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES as any,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};
