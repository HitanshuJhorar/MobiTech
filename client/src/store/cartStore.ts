import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../components/home/ProductCard';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity) => set((state) => {
        if (!product.inStock) return state; // Do not add if out of stock
        const existingItem = state.items.find(item => item.product.id === product.id);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
                : item
            )
          };
        }
        return { items: [...state.items, { product, quantity: Math.min(10, quantity) }] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.product.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity < 1) {
          return { items: state.items.filter(item => item.product.id !== productId) };
        }
        return {
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(10, quantity) }
              : item
          )
        };
      }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'mobitech-cart',
    }
  )
);
