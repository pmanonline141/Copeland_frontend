"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProduct, selectProductById, selectCatalogue } from "@/store/slices/catalogueSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { formatMinor } from "@/utils/format";
import { cn } from "@/utils/cn";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  RulerIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
  GlobeIcon,
  ClockIcon,
} from "@/components/ui/icons";
import { QuantityPicker } from "@/components/ui/QuantityPicker";
import { CopelandBadge } from "@/components/ui/Badge";
import { btn } from "@/components/ui/button";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProductById(id as string));
  const { detailStatus, detailError } = useAppSelector(selectCatalogue);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      if (product.sizes?.length && !selectedSize) setSelectedSize(product.sizes[0]);
      if (product.colours?.length && !selectedColor) setSelectedColor(product.colours[0]);
    }
  }, [product, selectedSize, selectedColor]);

  if (detailStatus === "loading" && !product) {
    return (
      <div className="container py-20">
        <div className="flex animate-pulse flex-col gap-10 lg:flex-row">
          <div className="aspect-square w-full rounded-2xl bg-mist lg:w-1/2" />
          <div className="flex flex-1 flex-col gap-4">
            <div className="h-8 w-3/4 rounded bg-mist" />
            <div className="h-6 w-1/4 rounded bg-mist" />
            <div className="mt-8 h-20 w-full rounded bg-mist" />
          </div>
        </div>
      </div>
    );
  }

  if (detailStatus === "failed" || !product) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-ink">Product not found</h2>
        <p className="mt-2 text-ink-soft">The product you're looking for might have been removed or is unavailable.</p>
        <button
          onClick={() => router.push("/shop")}
          className={btn("primary", "md", "mt-8 rounded-full")}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        size: selectedSize,
        colour: selectedColor,
        quantity,
        priceKobo: product.priceKobo,
        image: product.images?.[0],
      })
    );
    dispatch(setCartOpen(true));
  };

  const images = product.images?.length ? product.images : ["/placeholder-product.svg"];
  const badged = product.isCopelandLabel || product.label;

  return (
    <main className="min-h-screen bg-ivory pb-20">
      {/* Breadcrumbs */}
      <div className="container py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-bold text-ink-faint hover:text-ink transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="container">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* Gallery */}
          <div className="flex w-full flex-col gap-4 lg:w-1/2 lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-mist shadow-card">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {badged && (
                <div className="absolute left-6 top-6 scale-125 origin-top-left">
                  <CopelandBadge />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "aspect-square overflow-hidden rounded-xl border-2 transition-all",
                      activeImage === i ? "border-gold-700 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-1 flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink-faint">
                  {product.category}
                </p>
                <div className="flex items-center gap-1 text-gold-600">
                  <StarIcon className="h-4 w-4 fill-current" />
                  <span className="text-sm font-bold text-ink">4.8</span>
                  <span className="text-xs text-ink-faint font-medium">(124 reviews)</span>
                </div>
              </div>
              <h1 className="font-serif text-3xl font-bold text-ink lg:text-4xl">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-ink">{formatMinor(product.priceKobo)}</p>
            </div>

            {badged && (
              <div className="rounded-2xl border border-gold/30 bg-gold-50/50 p-5">
                <div className="flex items-center gap-2.5 text-gold-700">
                  <ShieldCheckIcon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-bold">Backed by Copeland</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft font-medium">
                  This item meets our highest standards for quality, construction, and delivery. 
                  Enjoy guaranteed fit and easy returns within 7 days.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-6">
              {/* Size Selector */}
              {product.sizes?.length && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                      Select Size
                    </p>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:underline">
                      <RulerIcon className="h-3.5 w-3.5" /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "flex min-w-[3.5rem] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all",
                          selectedSize === size
                            ? "border-gold-700 bg-gold-50 text-gold-700"
                            : "border-line text-ink-soft hover:border-ink-faint"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colours?.length && (
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
                    Select Color
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colours.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "flex min-w-[5rem] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all",
                          selectedColor === color
                            ? "border-gold-700 bg-gold-50 text-gold-700"
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
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
                  Quantity
                </p>
                <div className="flex items-center gap-4">
                  <QuantityPicker
                    value={quantity}
                    onChange={setQuantity}
                    max={product.quantityAvailable || 100}
                    className="h-12 px-2"
                  />
                  {product.quantityAvailable !== null && product.quantityAvailable <= 10 && (
                    <span className="text-xs font-bold text-warning uppercase tracking-wide">
                      Only {product.quantityAvailable} left!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <button
                onClick={handleAddToCart}
                className={btn("primary", "lg", "flex-1 rounded-full shadow-lg hover:-translate-y-0.5")}
              >
                Add to Cart
              </button>
              <button className={btn("outline", "lg", "flex-1 rounded-full")}>
                Buy Now
              </button>
            </div>

            {/* Shipping & Info */}
            <div className="mt-4 grid grid-cols-1 gap-6 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <TruckIcon className="mt-0.5 h-5 w-5 text-gold-600" />
                <div>
                  <p className="text-sm font-bold text-ink">Free delivery</p>
                  <p className="mt-0.5 text-xs text-ink-faint font-medium leading-relaxed">
                    On orders over ₦50,000 within Lagos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GlobeIcon className="mt-0.5 h-5 w-5 text-gold-600" />
                <div>
                  <p className="text-sm font-bold text-ink">Regional shipping</p>
                  <p className="mt-0.5 text-xs text-ink-faint font-medium leading-relaxed">
                    Cross-border delivery to West Africa.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 text-gold-600" />
                <div>
                  <p className="text-sm font-bold text-ink">Fast fulfilment</p>
                  <p className="mt-0.5 text-xs text-ink-faint font-medium leading-relaxed">
                    Dispatched within 24-48 hours.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="mt-0.5 h-5 w-5 text-gold-600" />
                <div>
                  <p className="text-sm font-bold text-ink">Secure payments</p>
                  <p className="mt-0.5 text-xs text-ink-faint font-medium leading-relaxed">
                    Protected by top-tier encryption.
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 flex flex-col gap-4 border-t border-line pt-8">
              <h2 className="text-lg font-bold text-ink">Product Description</h2>
              <div className="prose prose-sm max-w-none text-ink-soft font-medium leading-relaxed">
                {product.description || "No description available for this product."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
