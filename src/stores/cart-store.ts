import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CartItem } from "@/models/responses";

interface CartState {
  items: CartItem[];
  error: string | null;

  // Setters
  setItems: (items: CartItem[]) => void;
  setError: (error: string | null) => void;
  clearCart: () => void;

  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      error: null,

      setItems: items => set({ items }),
      setError: error => set({ error }),

      clearCart: () => set({ items: [], error: null }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);
