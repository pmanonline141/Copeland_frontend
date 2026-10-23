"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/store";
import { bindNotify } from "@/store/notify";
import { loadJSON, saveJSON, STORAGE_KEYS } from "@/store/persist";
import { fetchSession } from "@/store/slices/authSlice";
import { hydrateCart } from "@/store/slices/cartSlice";
import { hydratePendingOrder, type PendingOrder } from "@/store/slices/checkoutSlice";
import { setUnauthorizedHandler } from "@/services/apiClient";
import type { CartItem } from "@/types/order";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  storeRef.current ??= makeStore();

  useEffect(() => {
    const store = storeRef.current!;

    // Lets non-component code call notify.success(...) / notify.error(...)
    bindNotify(store.dispatch);

    // Restore the cart and any unpaid order after mount (not during render, to avoid hydration mismatches).
    store.dispatch(hydrateCart(loadJSON<CartItem[]>("local", STORAGE_KEYS.cart)));
    store.dispatch(hydratePendingOrder(loadJSON<PendingOrder>("session", STORAGE_KEYS.pendingOrder)));

    // Persist only when those slices actually change.
    let prevCart = store.getState().cart.items;
    let prevOrder = store.getState().checkout.pendingOrder;
    const unsubscribe = store.subscribe(() => {
      const { cart, checkout } = store.getState();
      if (cart.hydrated && cart.items !== prevCart) {
        prevCart = cart.items;
        saveJSON("local", STORAGE_KEYS.cart, cart.items.length ? cart.items : null);
      }
      if (checkout.pendingOrder !== prevOrder) {
        prevOrder = checkout.pendingOrder;
        saveJSON("session", STORAGE_KEYS.pendingOrder, prevOrder);
      }
    });

    // Restore the session from the cookie. On any 401, re-check the session once (not once per failed call);
    // route guards (useRequireAuth) then redirect to /login if the user really is signed out.
    store.dispatch(fetchSession());
    let refreshing = false;
    setUnauthorizedHandler(() => {
      if (refreshing) return;
      refreshing = true;
      void store.dispatch(fetchSession()).finally(() => {
        refreshing = false;
      });
    });

    return () => {
      unsubscribe();
      setUnauthorizedHandler(null);
      bindNotify(null);
    };
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
