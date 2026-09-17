import { Types, FilterQuery } from "mongoose";
import { Order, IOrder, IOrderItem } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { CreateOrderInput } from "../validators/order.validator.js";

function generateOrderNumber(): string {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `MOB-${datePart}-${random}`;
}

interface ListOrdersOptions {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  sort?: "newest" | "oldest";
}

export const orderService = {
  async create(input: CreateOrderInput): Promise<IOrder> {
    // Deduplicate product IDs by merging quantities
    const quantityMap = new Map<string, number>();
    for (const item of input.items) {
      const existing = quantityMap.get(item.productId) ?? 0;
      quantityMap.set(item.productId, existing + item.quantity);
    }

    // Validate and snapshot products
    const orderItems: IOrderItem[] = [];

    for (const [productId, quantity] of quantityMap.entries()) {
      if (!Types.ObjectId.isValid(productId)) {
        throw Object.assign(new Error(`Invalid product ID: ${productId}`), { status: 400 });
      }

      const product = await Product.findById(productId);

      if (!product) {
        throw Object.assign(new Error(`Product not found: ${productId}`), { status: 404 });
      }
      if (!product.isActive) {
        throw Object.assign(new Error(`Product is not available: ${product.name}`), { status: 400 });
      }
      if (!product.inStock || product.stockQuantity === 0) {
        throw Object.assign(new Error(`Out of stock: ${product.name}`), { status: 400 });
      }
      if (quantity > product.stockQuantity) {
        throw Object.assign(
          new Error(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`),
          { status: 400 }
        );
      }

      const lineTotal = product.price * quantity;
      orderItems.push({
        productId: product._id as Types.ObjectId,
        name: product.name,
        price: product.price,
        quantity,
        lineTotal,
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

    // Generate unique order number with simple retry on collision
    let orderNumber = generateOrderNumber();
    let attempts = 0;
    while (attempts < 3) {
      const existing = await Order.findOne({ orderNumber });
      if (!existing) break;
      orderNumber = generateOrderNumber();
      attempts++;
    }

    return Order.create({
      orderNumber,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      customerNote: input.customerNote,
      items: orderItems,
      subtotal,
      status: "pending",
      source: "whatsapp",
    });
  },

  async list(options: ListOrdersOptions) {
    const { page, limit, status, search, sort = "newest" } = options;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IOrder> = {};

    if (status && ["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
      ];
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .select("orderNumber customerName customerPhone subtotal status source createdAt")
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return {
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id: string): Promise<IOrder | null> {
    return Order.findById(id);
  },

  async updateStatus(id: string, status: string): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, { status }, { new: true });
  },
};
