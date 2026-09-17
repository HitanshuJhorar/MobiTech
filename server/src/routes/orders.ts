import { Router } from "express";
import { orderController } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Public: customers submit orders (WhatsApp enquiry flow)
router.post("/", orderController.create);

// Admin only
router.get("/", authMiddleware, orderController.list);
router.get("/:id", authMiddleware, orderController.getById);
router.patch("/:id/status", authMiddleware, orderController.updateStatus);

export default router;
