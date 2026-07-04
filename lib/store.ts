import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  stock_quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => boolean;
  updateQuantity: (id: string, quantity: number, stock_quantity?: number) => boolean;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        const qty = item.quantity ?? 1;
        const existing = get().items.find((e) => e.id === item.id);
        const currentQty = existing?.quantity ?? 0;
        const nextQty = currentQty + qty;

        if (nextQty > item.stock_quantity) return false;

        set((state) => {
          if (existing) {
            return {
              items: state.items.map((e) =>
                e.id === item.id ? { ...e, quantity: nextQty, stock_quantity: item.stock_quantity } : e
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: qty }],
          };
        });
        return true;
      },

      updateQuantity: (id, quantity, stock_quantity) => {
        const item = get().items.find((e) => e.id === id);
        if (!item) return false;
        const max = stock_quantity ?? item.stock_quantity;
        if (quantity > max) return false;

        set((state) => ({
          items: state.items
            .map((e) => (e.id === id ? { ...e, quantity, stock_quantity: max } : e))
            .filter((e) => e.quantity > 0),
        }));
        return true;
      },

      removeFromCart: (id) =>
        set((state) => ({ items: state.items.filter((e) => e.id !== id) })),

      clearCart: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'premium-store-cart' }
  )
);
