import { Request, Response, NextFunction } from "express";
import { inventoryService } from "../services/inventory.service.js";
import { setStockSchema, adjustStockSchema } from "../validators/inventory.validator.js";

export const inventoryController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const search = (req.query.search as string) || undefined;
      const category = (req.query.category as string) || undefined;
      const statusParam = (req.query.status as string) || "all";
      const status = ["all", "in-stock", "out-of-stock"].includes(statusParam)
        ? (statusParam as "all" | "in-stock" | "out-of-stock")
        : "all";

      const result = await inventoryService.list({ page, limit, search, category, status });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getLowStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const threshold = parseInt(req.query.threshold as string) || 5;
      if (threshold < 1 || threshold > 10_000) {
        res.status(400).json({ success: false, message: "threshold must be between 1 and 10000" });
        return;
      }
      const products = await inventoryService.getLowStock(threshold);
      res.json({ success: true, data: { products, threshold } });
    } catch (err) {
      next(err);
    }
  },

  async setStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = setStockSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const product = await inventoryService.setStock(req.params.productId, parsed.data.stockQuantity);
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      res.json({ success: true, data: { product } });
    } catch (err) {
      next(err);
    }
  },

  async adjustStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = adjustStockSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const product = await inventoryService.adjustStock(req.params.productId, parsed.data.quantity);
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      res.json({ success: true, data: { product } });
    } catch (err) {
      next(err);
    }
  },
};
