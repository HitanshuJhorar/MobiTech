import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { loginSchema } from "../validators/auth.validator.js";

const COOKIE_NAME = "mobitech_admin_token";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const authController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
        return;
      }

      const result = await authService.login(parsed.data.email, parsed.data.password);

      // Use generic error to avoid leaking account-existence information
      if (!result) {
        res.status(401).json({ success: false, message: "Invalid email or password" });
        return;
      }

      res.cookie(COOKIE_NAME, result.token, cookieOptions);

      res.json({ success: true, data: { admin: result.admin } });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({ success: true, data: { admin: req.admin } });
    } catch (err) {
      next(err);
    }
  },

  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie(COOKIE_NAME, { path: "/", httpOnly: true, secure: IS_PRODUCTION, sameSite: "lax" });
      res.json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  },
};
