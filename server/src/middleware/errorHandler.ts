import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  status?: number; // service-thrown business errors
}

export const errorHandler: ErrorRequestHandler = (
  err: MongoError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Server error:", err.message);

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    res.status(400).json({ success: false, message: "Invalid ID format" });
    return;
  }

  // Duplicate key (e.g. unique slug)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    res.status(409).json({ success: false, message: `Duplicate value for: ${field}` });
    return;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  // Business rule: stock adjustment would result in negative stock
  if (err.message === "INSUFFICIENT_STOCK") {
    res.status(400).json({ success: false, message: "Insufficient stock" });
    return;
  }

  // Service-thrown errors with explicit HTTP status (e.g. order validation)
  if (err.status && err.status >= 400 && err.status < 500) {
    res.status(err.status).json({ success: false, message: err.message });
    return;
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
