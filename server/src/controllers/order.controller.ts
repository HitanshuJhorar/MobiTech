import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service.js";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.validator.js";

export const orderController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
        return;
      }

      const order = await orderService.create(parsed.data);

      res.status(201).json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          status: order.status,
          subtotal: order.subtotal,
          createdAt: order.createdAt,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const status = (req.query.status as string) || undefined;
      const search = (req.query.search as string) || undefined;
      const sort = req.query.sort === "oldest" ? "oldest" : "newest";

      const result = await orderService.list({ page, limit, status, search, sort });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.getById(req.params.id);
      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateOrderStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const order = await orderService.updateStatus(req.params.id, parsed.data.status);
      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },
};
