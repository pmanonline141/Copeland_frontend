"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, selectCatalogue } from "@/store/slices/catalogueSlice";
import ProductCard from "@/components/ui/ProductCard";
import FilterSidebar from "@/components/ui/FilterSidebar";
import { FilterIcon, GridIcon, ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/utils/cn";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ShopPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { list, listStatus, listError } = useAppSelector(selectCatalogue);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const query = {
      category: searchParams.get("category") || undefined,
      label: searchParams.get("badge") === "true" ? true : undefined,
      q: searchParams.get("q") || undefined,
      tier: searchParams.get("tier") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: 20,
    };
    dispatch(fetchProducts(query));
  }, [dispatch, searchParams]);

  const products = list?.items || [];

  return (
    <main className="min-h-screen bg-ivory">
      {/* Page Header */}
      <div className="bg-white border-b border-line">
        <div className="container py-8 lg:py-12">
          <SectionHeading
            eyebrow="Copeland Catalogue"
            title={searchParams.get("category") ? `${searchParams.get("category")} collection` : "All Garments"}
            description="Premium quality garments, uniforms and workwear for Nigeria and West Africa."
          />
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Mobile Filter Trigger */}
          <div className="flex items-center justify-between border-b border-line pb-4 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 text-sm font-bold text-ink"
            >
              <FilterIcon className="h-4 w-4" /> Filters
            </button>
            <div className="flex items-center gap-4">
              <button className="text-ink-faint hover:text-ink">
                <GridIcon className="h-5 w-5" />
              </button>
              <button className="flex items-center gap-1 text-sm font-bold text-ink">
                Sort <ChevronDownIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sidebar Filters (Desktop) */}
          <FilterSidebar className="hidden w-64 shrink-0 lg:block" />

          {/* Product Grid */}
          <div className="flex-1">
            {/* Toolbar (Desktop) */}
            <div className="mb-8 hidden items-center justify-between lg:flex">
              <p className="text-sm font-medium text-ink-faint">
                Showing <span className="text-ink font-bold">{products.length}</span> of{" "}
                <span className="text-ink font-bold">{list?.total || 0}</span> products
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">View:</span>
                  <button className="text-gold-700">
                    <GridIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">Sort by:</span>
                  <button className="flex items-center gap-1 text-sm font-bold text-ink">
                    Default sorting <ChevronDownIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {listStatus === "loading" && products.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-product animate-pulse rounded-xl bg-mist" />
                ))}
              </div>
            ) : listStatus === "failed" ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <p className="text-ink-soft">Failed to load products.</p>
                <button
                  onClick={() => dispatch(fetchProducts({}))}
                  className="mt-4 text-sm font-bold text-gold-700 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <p className="text-lg font-bold text-ink">No products found</p>
                <p className="mt-1 text-ink-faint">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {list && list.totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                {Array.from({ length: list.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all",
                      list.page === i + 1
                        ? "bg-ink text-white shadow-card"
                        : "bg-white text-ink-soft hover:bg-mist"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-ivory p-6 shadow-overlay animate-drawer-in">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink">Filters</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-ink-faint hover:text-ink"
              >
                <FilterIcon className="h-6 w-6" />
              </button>
            </div>
            <FilterSidebar />
          </aside>
        </div>
      )}
    </main>
  );
}
