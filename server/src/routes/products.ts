import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Specific collection routes first (before /:id to avoid conflicts)
router.get("/featured", productController.getFeatured);
router.get("/trending", productController.getTrending);
router.get("/best-sellers", productController.getBestSellers);
router.get("/new", productController.getNew);
router.get("/slug/:slug", productController.getBySlug);

// Public list + detail
router.get("/", productController.list);
router.get("/:id", productController.getById);

// Admin-only
router.post("/", authMiddleware, productController.create);
router.patch("/:id", authMiddleware, productController.update);
router.delete("/:id", authMiddleware, productController.delete);

export default router;
