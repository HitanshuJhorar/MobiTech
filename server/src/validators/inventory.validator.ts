import { z } from "zod";

export const setStockSchema = z.object({
  stockQuantity: z
    .number({ required_error: "stockQuantity is required" })
    .int("Must be an integer")
    .min(0, "Cannot be negative")
    .max(100_000, "Exceeds maximum allowed quantity"),
});

export const adjustStockSchema = z.object({
  quantity: z
    .number({ required_error: "quantity is required" })
    .int("Must be an integer")
    .refine((v) => v !== 0, { message: "Quantity cannot be zero" })
    .refine((v) => v >= -10_000 && v <= 10_000, { message: "Quantity out of allowed range" }),
});

export type SetStockInput = z.infer<typeof setStockSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
