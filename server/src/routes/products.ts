import { Router } from "express";
import { productController } from "../controllers/product.controller.js";

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

// Admin-ready (auth middleware can be added here later)
router.post("/", productController.create);
router.patch("/:id", productController.update);
router.delete("/:id", productController.delete);

export default router;
