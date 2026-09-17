import api from './api';
import { ApiCategory } from '../types';

export const categoryService = {
  async getCategories(): Promise<ApiCategory[]> {
    const { data } = await api.get('/categories');
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
};
