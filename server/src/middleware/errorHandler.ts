import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
