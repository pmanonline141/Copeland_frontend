 "use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, selectCatalogue } from "@/store/slices/catalogueSlice";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/utils/cn";

/** Local, branded "photo coming soon" image for the sample cards (file: public/placeholder-product.svg). No external service. */
const PLACEHOLDER = "/placeholder-product.svg";

/**
 * PRD: the Copeland BADGE is the trust signal (reviewed, meets its tier standard, Copeland is accountable).
 * Badged items are Copeland's own range and commissioned private-label pieces; everything else is a supplier
 * listing with basic moderation only. So the tabs split on the badge.
 */
const TABS = [
  { id: "all", label: "All" },
  { id: "copeland", label: "Copeland badge" },
  { id: "suppliers", label: "Supplier listings" },
] as const;
type TabId = (typeof TABS)[number]["id"];

/** The live API sends `isCopelandLabel`; the local showcase data uses `label`. Accept either. */
type MaybeBadged = Product & { isCopelandLabel?: boolean };
const isBadged = (p: Product) => (p as MaybeBadged).isCopelandLabel === true || p.label === true;

/**
 * HOW THE LANDING FEED IS CHOSEN (MVP)
 * - Newest first. The heading says "New and noteworthy", and the PRD has no ratings/reviews and the MVP has no
 *   view or purchase history to rank by. When real order data exists, rank by units sold instead (needs a
 *   backend sort field), keep newest as the tie-breaker.
 * - Max 8 cards (two rows of four). "View all" opens the full /shop page.
 * - "All" tab: up to 4 badged (Copeland) pieces first so the trust signal is always visible, then supplier
 *   listings to fill the rest.
 * - Supplier tab: at most 2 listings per supplier, so one seller cannot fill the whole feed.
 * - We fetch 24 and pick client-side, so a tab never looks empty just because the newest 8 were all one kind.
 */
const FETCH_LIMIT = 24;
const MAX_ITEMS = 8;
const MAX_BADGED_IN_ALL = 4;
const MAX_PER_SUPPLIER = 2;

const byNewest = (a: Product, b: Product) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "");

function capPerSupplier(items: Product[]): Product[] {
  const seen = new Map<string, number>();
  return items.filter((p) => {
    const key = p.supplier?.id ?? p.supplierId ?? p.id; // no supplier info (showcase): each item counts alone
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    return n < MAX_PER_SUPPLIER;
  });
}

function pickFeed(source: Product[], tab: "all" | "copeland" | "suppliers"): Product[] {
  const sorted = [...source].sort(byNewest);
  const badged = sorted.filter(isBadged);
  const suppliers = capPerSupplier(sorted.filter((p) => !isBadged(p)));
  if (tab === "copeland") return badged.slice(0, MAX_ITEMS);
  if (tab === "suppliers") return suppliers.slice(0, MAX_ITEMS);
  const head = badged.slice(0, MAX_BADGED_IN_ALL);
  const tail = [...suppliers, ...badged.slice(MAX_BADGED_IN_ALL)].slice(0, MAX_ITEMS - head.length);
  return [...head, ...tail];
}

/**
 * Shown only while the catalogue is empty (pre-launch): the Copeland label range
 * and example supplier listings, so the storefront reads as a storefront.
 * Real products replace these the moment the API returns any.
 */
const SHOWCASE: Product[] = [
  {
    id: "showcase-oxford-shirt",
    name: "Copeland Oxford Shirt — Tailored Fit",
    description: "Two-ply Egyptian cotton, mother-of-pearl buttons. Copeland luxury tier.",
    category: "Shirts",
    priceKobo: 4_500_000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colours: ["Ivory", "Charcoal", "Navy"],
    label: true,
    tier: "Luxury",
    images: [PLACEHOLDER],
  },
  {
    id: "showcase-signature-blazer",
    name: "Signature Copeland Blazer",
    description: "Half-canvassed, structured shoulder, fine gold-toned lining. Copeland luxury tier.",
    category: "Outerwear",
    priceKobo: 18_500_000,
    sizes: ["38R", "40R", "42R", "44R"],
    label: true,
    tier: "Luxury",
    images: [PLACEHOLDER],
  },
  {
    id: "showcase-silk-tie",
    name: "Hand-finished Silk Tie",
    description: "Mulberry silk, subtle gold jacquard. Copeland luxury tier.",
    category: "Accessories",
    priceKobo: 1_850_000,
    label: true,
    tier: "Luxury",
    images: [PLACEHOLDER],
  },
  {
    id: "showcase-ankara-set",
    name: "Ankara Print Two-Piece Set",
    description: "Cotton wax print, tailored top and trousers. Made in Lagos.",
    category: "Women",
    priceKobo: 3_200_000,
    sizes: ["XS", "S", "M", "L", "XL"],
    colours: ["Indigo", "Terracotta"],
    label: false,
    images: [PLACEHOLDER],
  },
  {
    id: "showcase-uniform-set",
    name: "Corporate Uniform Set — Bulk Pack",
    description: "Embroiderable chest, poly-cotton twill. Priced per 10 units.",
    category: "Uniforms & workwear",
    priceKobo: 9_600_000,
    moq: 10,
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colours: ["Navy", "Black", "Sky"],
    label: false,
    quantityAvailable: 8,
    images: [PLACEHOLDER],
  },
  {
    id: "showcase-scrub-set",
    name: "Medical Scrub Set",
    description: "Four-way stretch, anti-microbial finish. Hospitals and clinics.",
    category: "Medical & scrubs",
    priceKobo: 2_450_000,
    moq: 20,
    sizes: ["S", "M", "L", "XL"],
    colours: ["Ceil", "Navy", "Graphite"],
    label: false,
    images: [PLACEHOLDER],
  },
];

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
      <div className="aspect-product bg-shimmer bg-[length:200%_100%] animate-shimmer" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer" />
        <div className="h-4 w-4/5 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer" />
        <div className="h-4 w-1/2 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const { list, listStatus } = useAppSelector(selectCatalogue);
  const [tab, setTab] = useState<TabId>("all");

  useEffect(() => {
    if (listStatus === "idle") void dispatch(fetchProducts({ page: 1, limit: FETCH_LIMIT }));
  }, [listStatus, dispatch]);

  const liveItems = list?.items ?? [];
  const usingShowcase = liveItems.length === 0;
  const source = usingShowcase ? SHOWCASE : liveItems;
  const items = pickFeed(source, tab);

  const loading = listStatus === "loading" && usingShowcase;

  // "View all" keeps the visitor's tab: the shop page applies the same filter.
  const viewAllHref = tab === "copeland" ? "/shop?badge=true" : tab === "suppliers" ? "/shop?badge=false" : "/shop";
  const total = usingShowcase ? 0 : (list?.total ?? liveItems.length);
  const viewAllLabel = total > items.length ? `View all ${total} products` : "View all products";
  const emptyMessage =
    tab === "copeland"
      ? "Copeland label pieces are coming soon. Each one is reviewed and approved before it is listed."
      : "Nothing here yet. As suppliers are approved, their listings appear in this feed.";

  return (
    <section id="featured" className="bg-ivory py-16 sm:py-20">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The catalogue"
            title="New and noteworthy"
            description="Moderated garments from verified suppliers, alongside the Copeland label. Badged items carry Copeland's accountability."
          />
          <Link href={viewAllHref} className="link-underline hidden items-center gap-1.5 text-sm font-semibold text-gold-700 sm:inline-flex">
            {viewAllLabel} <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter products">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "min-h-touch rounded-full border px-4 text-sm font-medium transition-colors duration-fast",
                tab === t.id ? "border-ink bg-ink text-white" : "border-line bg-paper text-ink-soft hover:border-ink/30 hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-line bg-paper p-10 text-center text-sm text-ink-soft">
            {emptyMessage}
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {items.map((p, i) => (
              <Reveal as="li" key={p.id} delay={(i % 4) * 70}>
                {/* Showcase cards are sample data with no real product page: make them non-clickable. */}
                <div inert={usingShowcase}>
                  <ProductCard product={p} />
                </div>
              </Reveal>
            ))}
          </ul>
        )}

        {/* Bottom call to action: the main route to the full catalogue (also the only one on phones) */}
        {!usingShowcase && items.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href={viewAllHref}
              className="group inline-flex min-h-touch items-center gap-2 rounded-full border border-ink bg-ink px-6 text-sm font-semibold text-white transition-colors duration-fast hover:border-gold hover:bg-navy"
            >
              {viewAllLabel}
              <ArrowRightIcon className="h-4 w-4 text-gold-300 transition-transform duration-base ease-out-soft group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {usingShowcase && !loading && (
          <p className="mt-6 text-center text-xs text-ink-faint">
            Preview — live supplier listings appear here as partners are approved and products pass moderation.
          </p>
        )}
      </div>
    </section>
  );
}