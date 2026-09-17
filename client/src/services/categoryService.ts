import api from './api';
import { ApiCategory } from '../types';

export const categoryService = {
  async getCategories(): Promise<ApiCategory[]> {
    const { data } = await api.get('/categories');
    return data.data;
  },

  async getAdminCategories(status?: 'all' | 'active' | 'inactive'): Promise<ApiCategory[]> {
    const params = status && status !== 'all' ? { status } : {};
    const { data } = await api.get('/categories/admin', { params });
    return data.data;
  },

  async getCategoryById(id: string): Promise<ApiCategory> {
    const { data } = await api.get(`/categories/${id}`);
    return data.data;
  },

  async getCategoryBySlug(slug: string): Promise<ApiCategory> {
    const { data } = await api.get(`/categories/slug/${slug}`);
    return data.data;
  },

  async createCategory(categoryData: Partial<ApiCategory>): Promise<ApiCategory> {
    const { data } = await api.post('/categories', categoryData);
    return data.data;
  },

  async updateCategory(id: string, categoryData: Partial<ApiCategory>): Promise<ApiCategory> {
    const { data } = await api.patch(`/categories/${id}`, categoryData);
    return data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
