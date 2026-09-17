import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { Admin } from "../models/Admin.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.mobitech_admin_token as string | undefined;

  if (!token) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  try {
    const payload = verifyToken(token);
    const admin = await Admin.findById(payload.sub).select("email name isActive");

    if (!admin || !admin.isActive) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    req.admin = {
      id: (admin._id as { toString(): string }).toString(),
      email: admin.email,
      name: admin.name,
    };

    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
