import { z } from "zod";

const ORDER_STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;

export const createOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(100).trim(),
  customerPhone: z.string().min(5, "Phone is required").max(20).trim(),
  customerEmail: z.string().email("Invalid email").toLowerCase().trim().optional(),
  customerNote: z.string().max(500).trim().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z
          .number({ required_error: "Quantity is required" })
          .int("Must be an integer")
          .min(1, "Minimum quantity is 1")
          .max(100, "Maximum quantity per item is 100"),
      })
    )
    .min(1, "At least one item is required")
    .max(50, "Too many items"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES, { required_error: "Status is required" }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
