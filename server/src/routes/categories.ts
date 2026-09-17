import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";

const router = Router();

// Public
router.get("/", categoryController.getAll);
router.get("/slug/:slug", categoryController.getBySlug);
router.get("/:id", categoryController.getById);

// Admin-ready (auth middleware can be added here later)
router.post("/", categoryController.create);
router.patch("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

export default router;
