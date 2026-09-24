import { FilterQuery } from "mongoose";
import { Product, IProduct } from "../models/Product.js";
import { Category } from "../models/Category.js";

interface ListInventoryOptions {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  status?: "all" | "in-stock" | "out-of-stock";
  productStatus?: "all" | "active" | "inactive";
}

// Lightweight projection for inventory responses
const INVENTORY_PROJECTION = "name category stockQuantity inStock isActive price images slug";

export const inventoryService = {
  async list(options: ListInventoryOptions) {
    const { page, limit, search, category, status = "all", productStatus = "active" } = options;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IProduct> = {};
    if (productStatus === "active") filter.isActive = true;
    else if (productStatus === "inactive") filter.isActive = false;
    // "all" means no isActive filter

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      const catDoc = await Category.findOne({ slug: category });
      filter.category = catDoc ? catDoc._id : category;
    }

    if (status === "in-stock") {
      filter.inStock = true;
    } else if (status === "out-of-stock") {
      filter.inStock = false;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select(INVENTORY_PROJECTION)
        .populate("category", "name slug")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return {
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getLowStock(threshold: number) {
    return Product.find({
      isActive: true,
      stockQuantity: { $gt: 0, $lte: threshold },
    })
      .select(INVENTORY_PROJECTION)
      .populate("category", "name slug")
      .sort({ stockQuantity: 1 });
  },

  async setStock(productId: string, stockQuantity: number): Promise<IProduct | null> {
    const inStock = stockQuantity > 0;
    return Product.findByIdAndUpdate(
      productId,
      { stockQuantity, inStock },
      { new: true }
    ).select(INVENTORY_PROJECTION);
  },

  async adjustStock(productId: string, adjustment: number): Promise<IProduct | null> {
    // Atomic increment - MongoDB rejects if result would be negative via $inc
    // We check current value first to give a clear error message
    const product = await Product.findById(productId).select("stockQuantity");
    if (!product) return null;

    const newQty = product.stockQuantity + adjustment; 
    if (newQty < 0) {
      throw new Error("INSUFFICIENT_STOCK");
    }

    const inStock = newQty > 0;
    return Product.findByIdAndUpdate(
      productId,
      { $inc: { stockQuantity: adjustment }, inStock },
      { new: true }
    ).select(INVENTORY_PROJECTION);
  },
};
