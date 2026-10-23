import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CheckoutInput } from "@/types/order";
import { createOrder } from "./checkoutSlice";

export interface CartState {
  items: CartItem[];
  /** False until localStorage has been read (do it after mount to avoid a hydration mismatch). */
  hydrated: boolean;
}
const initialState: CartState = { items: [], hydrated: false };

const MAX_ITEMS = 100; // API limit per order
const MAX_QTY = 100_000;
const same = (a: CartItem, b: Pick<CartItem, "productId" | "size" | "colour">) =>
  a.productId === b.productId && (a.size ?? "") === (b.size ?? "") && (a.colour ?? "") === (b.colour ?? "");
const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number.isFinite(n) ? n : 1)));

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, a: PayloadAction<CartItem[] | null>) {
      if (!state.hydrated) state.items = Array.isArray(a.payload) ? a.payload.filter((i) => i && typeof i.productId === "string" && i.quantity > 0).slice(0, MAX_ITEMS) : [];
      state.hydrated = true;
    },
    addToCart(state, a: PayloadAction<CartItem>) {
      const item = { ...a.payload, quantity: clampQty(a.payload.quantity) };
      const existing = state.items.find((i) => same(i, item));
      if (existing) existing.quantity = clampQty(existing.quantity + item.quantity);
      else if (state.items.length < MAX_ITEMS) state.items.push(item);
    },
    setQuantity(state, a: PayloadAction<Pick<CartItem, "productId" | "size" | "colour"> & { quantity: number }>) {
      const i = state.items.find((x) => same(x, a.payload));
      if (!i) return;
      if (a.payload.quantity <= 0) state.items = state.items.filter((x) => x !== i);
      else i.quantity = clampQty(a.payload.quantity);
    },
    removeFromCart(state, a: PayloadAction<Pick<CartItem, "productId" | "size" | "colour">>) {
      state.items = state.items.filter((i) => !same(i, a.payload));
    },
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (b) => {
    // The items now belong to a pending order (stock is reserved), so the cart empties.
    b.addCase(createOrder.fulfilled, (s) => {
      s.items = [];
    });
  },
});

export const { hydrateCart, addToCart, setQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

type S = { cart: CartState };
export const selectCartItems = (s: S) => s.cart.items;
export const selectCartHydrated = (s: S) => s.cart.hydrated;
export const selectCartCount = (s: S) => s.cart.items.reduce((n, i) => n + i.quantity, 0);
/** Estimate for display only. The server calculates the real total at checkout. */
export const selectCartEstimateKobo = (s: S) => s.cart.items.reduce((n, i) => n + (i.priceKobo ?? 0) * i.quantity, 0);

/** Items in the exact shape POST /api/orders/checkout and /rfqs accept (no display fields, no empty options). */
export const selectCheckoutItems = createSelector([selectCartItems], (items): CheckoutInput["items"] =>
  items.map((i) => ({ productId: i.productId, quantity: i.quantity, ...(i.size ? { size: i.size } : {}), ...(i.colour ? { colour: i.colour } : {}) })),
);
