import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation error",
      details: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message
      }))
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message
    });
    return;
  }

  if (err.message === "Invalid email or password") {
    res.status(401).json({ error: err.message });
    return;
  }

  if (err.message.includes("already exists")) {
    res.status(409).json({ error: err.message });
    return;
  }

  if (err.message.includes("not found") || err.message.includes("does not exist")) {
    res.status(404).json({ error: err.message });
    return;
  }

  res.status(500).json({
    error: "Internal server error"
  });
}
