import api from './api';

export interface InventoryProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { _id: string; name: string; slug: string } | string;
  stockQuantity: number;
  inStock: boolean;
  isActive: boolean;
}

export interface InventoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetInventoryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: 'all' | 'in-stock' | 'out-of-stock';
  productStatus?: 'all' | 'active' | 'inactive';
}

export const inventoryService = {
  async getInventory(params: GetInventoryParams = {}): Promise<{ products: InventoryProduct[]; pagination: InventoryPagination }> {
    const { data } = await api.get('/inventory', { params });
    return data.data;
  },

  async getLowStock(threshold = 5): Promise<{ products: InventoryProduct[]; threshold: number }> {
    const { data } = await api.get('/inventory/low-stock', { params: { threshold } });
    return data.data;
  },

  async setStock(productId: string, stockQuantity: number): Promise<InventoryProduct> {
    const { data } = await api.patch(`/inventory/${productId}`, { stockQuantity });
    return data.data.product;
  },

  async adjustStock(productId: string, quantity: number): Promise<InventoryProduct> {
    const { data } = await api.post(`/inventory/${productId}/adjust`, { quantity });
    return data.data.product;
  },
};
