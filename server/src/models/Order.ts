import { Schema, model, Document, Types } from "mongoose";

export type OrderStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type OrderSource = "whatsapp";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNote?: string;
  items: IOrderItem[];
  subtotal: number;
  status: OrderStatus;
  source: OrderSource;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    customerPhone: { type: String, required: true, trim: true, maxlength: 20 },
    customerEmail: { type: String, trim: true, lowercase: true },
    customerNote: { type: String, trim: true, maxlength: 500 },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    source: {
      type: String,
      enum: ["whatsapp"],
      default: "whatsapp",
    },
  },
  { timestamps: true }
);

// Index for fast lookup
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

export const Order = model<IOrder>("Order", orderSchema);
