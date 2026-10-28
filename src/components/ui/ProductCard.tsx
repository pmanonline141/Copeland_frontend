"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { formatMinor } from "@/utils/format";
import { cn } from "@/utils/cn";
import { CopelandBadge } from "./Badge";
import { ArrowRightIcon, PlusIcon, RulerIcon, ShieldCheckIcon } from "./icons";
import VariationModal from "./VariationModal";
import { useAppDispatch } from "@/store/hooks";
import { setCartOpen } from "@/store/slices/uiSlice";

/** Shown when a product has no photo, or its photo fails to load (file: public/placeholder-product.svg). */
const PLACEHOLDER = "/placeholder-product.svg";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/**
 * Catalogue card (landing feed and /shop). It follows the PRD's trust model:
 *  - BADGED items (isCopelandLabel): Copeland badge, tier, "Backed by Copeland". The supplier is NEVER shown,
 *    because commissioned private-label pieces are published without the supplier's identity.
 *  - NON-BADGED supplier items: "Sold by <supplier>" so the buyer knows who they are buying from
 *    (basic moderation only, lower accountability signal).
 * Images come from unknown hosts, so a plain <img> is used instead of next/image.
 */
export default function ProductCard({ product, className }: { product: Product; className?: string }) {
  const dispatch = useAppDispatch();
  const [mainFailed, setMainFailed] = useState(false);
  const [altFailed, setAltFailed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const first = product.images?.[0];
  const second = product.images?.[1];
  const mainSrc = first && !mainFailed ? first : PLACEHOLDER;
  // Second photo crossfades in on hover (only when the first one is a real photo).
  const altSrc = first && !mainFailed && second && !altFailed ? second : undefined;

  const badged = product.isCopelandLabel === true || product.label === true;
  const qty = typeof product.quantityAvailable === "number" ? product.quantityAvailable : undefined;
  const soldOut = qty === 0;
  const lowStock = qty !== undefined && qty > 0 && qty <= 10;
  const bulk = typeof product.moq === "number" && product.moq > 1;
  const supplierName = product.supplier?.name;
  const colourCount = product.colours?.length ?? 0;
  const href = `/shop/${product.id}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-card transition-all duration-base ease-out-soft hover:-translate-y-1 hover:border-gold/40 hover:shadow-card-hover",
        className,
      )}
    >
      {/* Image */}
      <Link href={href} aria-label={product.name} className="relative block aspect-product overflow-hidden bg-mist">
        <img
          src={mainSrc}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={() => setMainFailed(true)}
          className={cn(
            "h-full w-full object-cover transition-all duration-slow ease-out-soft group-hover:scale-[1.05]",
            soldOut && "opacity-60 grayscale",
          )}
        />
        {altSrc && (
          <img
            src={altSrc}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            onError={() => setAltFailed(true)}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-slow ease-out-soft group-hover:opacity-100"
          />
        )}

        {/* Top-left: trust and availability signals */}
        <span className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {badged && (
            <span title="Reviewed, approved and backed by Copeland">
              <CopelandBadge />
            </span>
          )}
          {soldOut && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white">
              Sold out
            </span>
          )}
          {lowStock && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-warning ring-1 ring-warning/30">
              Only {qty} left
            </span>
          )}
        </span>

        {/* Desktop: slide-up call to action on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full items-center justify-center gap-1.5 bg-navy/90 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur transition-transform duration-base ease-out-soft group-hover:translate-y-0 lg:flex"
        >
          View details <ArrowRightIcon className="h-3.5 w-3.5 text-gold-300" />
        </span>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">{product.category}</p>

        <h3 className="line-clamp-2 font-sans text-sm font-semibold leading-snug text-ink">
          <Link href={href} className="transition-colors duration-fast hover:text-gold-700">
            {product.name}
          </Link>
        </h3>

        {badged ? (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gold-700">
            <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{product.tier ? `${cap(product.tier)} tier · ` : ""}Backed by Copeland</span>
          </p>
        ) : (
          supplierName && (
            <p className="truncate text-xs text-ink-faint">
              Sold by <span className="font-semibold text-ink-soft">{supplierName}</span>
            </p>
          )
        )}

        {(product.sizes?.length || colourCount > 0) && (
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-faint">
            <RulerIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {product.sizes && product.sizes.length > 0 && product.sizes.slice(0, 5).join(" · ")}
              {product.sizes && product.sizes.length > 0 && colourCount > 0 && "  |  "}
              {colourCount > 0 && `${colourCount} colour${colourCount === 1 ? "" : "s"}`}
            </span>
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line/70 pt-3">
          <div>
            <p className="font-sans text-base font-bold text-ink">{formatMinor(product.priceKobo)}</p>
            {bulk && <p className="text-[0.7rem] font-medium text-ink-faint">Min. order {product.moq}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={href}
              aria-label={`View ${product.name}`}
              className="hidden items-center gap-1 text-xs font-semibold text-gold-700 transition-all duration-base ease-out-soft group-hover:translate-x-0.5 group-hover:text-gold-800 sm:flex"
            >
              View <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white shadow-sm transition-all duration-base hover:bg-gold-700 hover:scale-110 active:scale-95"
              aria-label="Add to cart"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <VariationModal
         product={product}
         open={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onAdded={() => {
           setIsModalOpen(false);
           dispatch(setCartOpen(true));
         }}
       />
    </article>
  );
}