import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: "customer" | "worker" | "admin";
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.substring(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  req.user = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  };

  next();
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (payload) {
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      };
    }
  }

  next();
}
