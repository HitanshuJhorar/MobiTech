import { Category, ICategory } from "../models/Category.js";
import { CreateCategoryInput, UpdateCategoryInput } from "../validators/category.validator.js";
import { FilterQuery } from "mongoose";

export const categoryService = {
  async getAll(): Promise<ICategory[]> {
    return Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
  },

  async getAdminAll(status?: "all" | "active" | "inactive"): Promise<ICategory[]> {
    const filter: FilterQuery<ICategory> = {};
    if (status === "active") filter.isActive = true;
    else if (status === "inactive") filter.isActive = false;
    return Category.find(filter).sort({ sortOrder: 1, name: 1 });
  },

  async getById(id: string): Promise<ICategory | null> {
    return Category.findById(id);
  },

  async getBySlug(slug: string): Promise<ICategory | null> {
    return Category.findOne({ slug });
  },

  async create(data: CreateCategoryInput): Promise<ICategory> {
    return Category.create(data);
  },

  async update(id: string, data: UpdateCategoryInput): Promise<ICategory | null> {
    return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id: string): Promise<ICategory | null> {
    return Category.findByIdAndDelete(id);
  },
};
