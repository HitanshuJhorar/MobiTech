import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Public
router.get("/", categoryController.getAll);
router.get("/slug/:slug", categoryController.getBySlug);
router.get("/:id", categoryController.getById);

// Admin-only
router.post("/", authMiddleware, categoryController.create);
router.patch("/:id", authMiddleware, categoryController.update);
router.delete("/:id", authMiddleware, categoryController.delete);

export default router;
