import { Router } from "express";
import { inventoryController } from "../controllers/inventory.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All inventory routes require admin authentication
router.get("/", authMiddleware, inventoryController.list);
router.get("/low-stock", authMiddleware, inventoryController.getLowStock);
router.patch("/:productId", authMiddleware, inventoryController.setStock);
router.post("/:productId/adjust", authMiddleware, inventoryController.adjustStock);

export default router;
