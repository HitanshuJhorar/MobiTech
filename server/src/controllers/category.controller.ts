import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/category.service.js";
import { Product } from "../models/Product.js";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";

export const categoryController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAll();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },

  async adminGetAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statusParam = req.query.status as string;
      const status = ["all", "active", "inactive"].includes(statusParam) ? (statusParam as "all" | "active" | "inactive") : "all";
      const categories = await categoryService.getAdminAll(status);
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.getById(req.params.id);
      if (!category) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
      }
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.getBySlug(req.params.slug);
      if (!category) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
      }
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createCategorySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const category = await categoryService.create(parsed.data);
      res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateCategorySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const category = await categoryService.update(req.params.id, parsed.data);
      if (!category) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
      }
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Prevent deletion if ANY products reference this category to avoid orphaned products
      const activeProducts = await Product.countDocuments({ category: req.params.id });
      if (activeProducts > 0) {
        res.status(409).json({
          success: false,
          message: `Cannot delete: ${activeProducts} product(s) reference this category.`,
        });
        return;
      }
      const category = await categoryService.delete(req.params.id);
      if (!category) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
      }
      res.json({ success: true, message: "Category deleted" });
    } catch (err) {
      next(err);
    }
  },
};
