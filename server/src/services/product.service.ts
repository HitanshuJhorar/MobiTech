import { FilterQuery } from "mongoose";
import { Product, IProduct } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { CreateProductInput, UpdateProductInput } from "../validators/product.validator.js";

interface ListProductsOptions {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  sort?: string;
  inStock?: boolean;
}

export const productService = {
  async list(options: ListProductsOptions) {
    const { page, limit, search, category, sort, inStock } = options;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IProduct> = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      // category can be a slug or ObjectId
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        filter.category = catDoc._id;
      } else {
        filter.category = category; // try as ObjectId, let Mongoose handle invalid
      }
    }

    if (inStock !== undefined) {
      filter.inStock = inStock;
    }

    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price-asc") sortQuery = { price: 1 };
    else if (sort === "price-desc") sortQuery = { price: -1 };
    else if (sort === "newest") sortQuery = { createdAt: -1 };
    else if (sort === "featured") sortQuery = { isFeatured: -1, createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string): Promise<IProduct | null> {
    return Product.findById(id).populate("category", "name slug");
  },

  async getBySlug(slug: string): Promise<IProduct | null> {
    return Product.findOne({ slug, isActive: true }).populate("category", "name slug");
  },

  async getFeatured(): Promise<IProduct[]> {
    return Product.find({ isFeatured: true, isActive: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
  },

  async getTrending(): Promise<IProduct[]> {
    return Product.find({ isTrending: true, isActive: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
  },

  async getBestSellers(): Promise<IProduct[]> {
    return Product.find({ isBestSeller: true, isActive: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
  },

  async getNew(): Promise<IProduct[]> {
    return Product.find({ isNewArrival: true, isActive: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
  },

  async create(data: CreateProductInput): Promise<IProduct> {
    return Product.create(data);
  },

  async update(id: string, data: UpdateProductInput): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("category", "name slug");
  },

  async delete(id: string): Promise<IProduct | null> {
    return Product.findByIdAndDelete(id);
  },
};
