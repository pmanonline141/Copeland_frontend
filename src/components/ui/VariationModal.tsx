"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "./Modal";
import { QuantityPicker } from "./QuantityPicker";
import { formatMinor } from "@/utils/format";
import type { Product } from "@/types/product";
import { cn } from "@/utils/cn";
import { CloseIcon } from "./icons";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";

interface VariationModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

export default function VariationModal({ product, open, onClose, onAdded }: VariationModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product.colours?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  const mainImage = product.images?.[0] || "/placeholder-product.svg";

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        size: selectedSize,
        colour: selectedColor,
        quantity,
        priceKobo: product.priceKobo,
        image: mainImage,
      })
    );
    
    if (onAdded) {
      onAdded();
    } else {
      onClose();
    }
  };

  const handleGoToCart = () => {
    handleAddToCart();
    // VariationModal in ProductCard will now pass onAdded that triggers CartDrawer
    // But if they click "Go to Cart" specifically, we might want to navigate
    // However, the user asked for a slide-out cart, so staying on page and sliding out is better.
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 rounded-full p-2 text-ink-faint transition-colors hover:bg-mist hover:text-ink"
          aria-label="Close modal"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-xl font-bold text-ink">Please select a variation</h2>

        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-mist sm:w-40">
            <img
              src={mainImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info & Options */}
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <h3 className="font-sans text-base font-semibold text-ink">{product.name}</h3>
              <p className="mt-1 text-lg font-bold text-ink">{formatMinor(product.priceKobo)}</p>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "flex min-w-[3rem] items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium transition-all",
                        selectedSize === size
                          ? "border-gold-700 bg-gold-50 text-gold-700 ring-1 ring-gold-700"
                          : "border-line text-ink-soft hover:border-ink-faint"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colours && product.colours.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  Color
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colours.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-sm font-medium transition-all",
                        selectedColor === color
                          ? "border-gold-700 bg-gold-50 text-gold-700 ring-1 ring-gold-700"
                          : "border-line text-ink-soft hover:border-ink-faint"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                Quantity
              </p>
              <QuantityPicker
                value={quantity}
                onChange={setQuantity}
                max={product.quantityAvailable || undefined}
                className="w-fit"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-full border border-ink py-3 text-sm font-bold text-ink transition-colors hover:bg-mist"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleGoToCart}
            className="flex-1 rounded-full bg-gold-600 py-3 text-sm font-bold text-white transition-all hover:bg-gold-700 hover:shadow-lg active:scale-[0.98]"
          >
            Go to Cart
          </button>
        </div>
      </div>
    </Modal>
  );
}
