import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "customer" | "worker" | "admin";
  type: "access" | "refresh";
}

export function generateAccessToken(payload: Omit<JWTPayload, "type">): string {
  return jwt.sign(
    { ...payload, type: "access" },
    env.jwtSecret,
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken(payload: Omit<JWTPayload, "type">): string {
  return jwt.sign(
    { ...payload, type: "refresh" },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JWTPayload;
    if (decoded.type !== "access") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JWTPayload;
    if (decoded.type !== "refresh") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
