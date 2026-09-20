import api from './api';

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type OrderSource = 'whatsapp';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNote?: string;
  items: OrderItem[];
  subtotal: number;
  status: OrderStatus;
  source: OrderSource;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListItem {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  status: OrderStatus;
  source: OrderSource;
  createdAt: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: 'newest' | 'oldest';
}

export interface OrdersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const orderService = {
  async listOrders(params: GetOrdersParams = {}): Promise<{ orders: OrderListItem[]; pagination: OrdersPagination }> {
    const { data } = await api.get('/orders', { params });
    return data.data;
  },

  async getOrder(id: string): Promise<Order> {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data.data;
  },
};
