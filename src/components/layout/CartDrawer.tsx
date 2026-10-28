"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartEstimateKobo,
  removeFromCart,
  setQuantity,
} from "@/store/slices/cartSlice";
import { formatMinor } from "@/utils/format";
import { cn } from "@/utils/cn";
import { BagIcon, CloseIcon, TrashIcon } from "@/components/ui/icons";
import { QuantityPicker } from "@/components/ui/QuantityPicker";
import { btn } from "@/components/ui/button";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartEstimateKobo);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[100] transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside
        ref={drawerRef}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-overlay transition-transform duration-300 ease-out-soft",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-line px-6">
          <h2 className="text-lg font-bold text-ink">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-mist hover:text-ink"
            aria-label="Close cart"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-mist">
                <BagIcon className="h-10 w-10 text-ink-faint" />
              </div>
              <p className="mt-4 font-medium text-ink-soft">Your cart is currently empty.</p>
              <button
                onClick={onClose}
                className={btn("primary", "md", "mt-6 rounded-full")}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.colour}`} className="flex gap-4">
                  {/* Item Image */}
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-mist">
                    <img
                      src={item.image || "/placeholder-product.svg"}
                      alt={item.name || "Product"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between gap-2">
                        <h3 className="line-clamp-1 text-sm font-semibold text-ink">
                          {item.name}
                        </h3>
                        <p className="text-sm font-bold text-ink">
                          {formatMinor((item.priceKobo || 0) * item.quantity)}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-ink-faint">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.colour && " · "}
                        {item.colour && `Color: ${item.colour}`}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <QuantityPicker
                        value={item.quantity}
                        onChange={(qty) =>
                          dispatch(
                            setQuantity({
                              productId: item.productId,
                              size: item.size,
                              colour: item.colour,
                              quantity: qty,
                            })
                          )
                        }
                        className="h-8 py-0"
                      />
                      <button
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: item.productId,
                              size: item.size,
                              colour: item.colour,
                            })
                          )
                        }
                        className="text-xs font-semibold text-ink-faint transition-colors hover:text-error"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-line bg-mist/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-ink-soft">Subtotal</span>
              <span className="text-lg font-bold text-ink">{formatMinor(subtotal)}</span>
            </div>
            <p className="mb-6 text-xs text-ink-faint">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={onClose}
              className={btn("primary", "lg", "w-full rounded-full")}
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>,
    document.body
  );
}
