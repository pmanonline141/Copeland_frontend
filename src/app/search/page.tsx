"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, selectCatalogue } from "@/store/slices/catalogueSlice";
import ProductCard from "@/components/ui/ProductCard";
import { SearchIcon, FilterIcon, ChevronDownIcon } from "@/components/ui/icons";
import SectionHeading from "@/components/ui/SectionHeading";

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const { list, listStatus } = useAppSelector(selectCatalogue);

  useEffect(() => {
    dispatch(fetchProducts({ q, limit: 24 }));
  }, [dispatch, q]);

  const products = list?.items || [];

  return (
    <main className="min-h-screen bg-ivory pb-20">
      {/* Search Header */}
      <div className="bg-white border-b border-line">
        <div className="container py-12 lg:py-16">
          <SectionHeading
            eyebrow="Search Results"
            title={q ? `Results for "${q}"` : "Search our catalogue"}
            description={
              products.length > 0
                ? `We found ${list?.total} garments matching your search.`
                : q
                ? "We couldn't find any garments matching your search. Try different keywords."
                : "Enter keywords above to search for specific garments, categories or suppliers."
            }
          />

          {/* Large Search Bar */}
          <form action="/search" method="get" className="mt-10 max-w-2xl">
            <div className="group relative">
              <SearchIcon className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint group-focus-within:text-gold-600" />
              <input
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Search by product, category, or tier..."
                className="h-16 w-full rounded-2xl border border-line bg-mist/30 pl-14 pr-6 text-lg font-semibold placeholder:text-ink-faint transition-all focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10"
              />
              <button
                type="submit"
                className="absolute right-3 top-3 h-10 rounded-xl bg-ink px-6 text-sm font-bold text-white shadow-card transition-all hover:bg-ink-soft active:scale-95"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mt-12">
        {listStatus === "loading" && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-product animate-pulse rounded-xl bg-mist" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-faint">
                Garments found
              </h2>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm font-bold text-ink">
                  Sort <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : q ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-mist">
              <SearchIcon className="h-10 w-10 text-ink-faint" />
            </div>
            <h3 className="text-xl font-bold text-ink">No results for "{q}"</h3>
            <p className="mt-2 max-w-xs text-ink-soft font-medium">
              Try checking your spelling or using more general terms like "shirt", "men", or "scrubs".
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
