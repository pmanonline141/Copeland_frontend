"use client";

import { useState } from "react";
import { ChevronDownIcon, FilterIcon } from "./icons";
import { cn } from "@/utils/cn";

interface FilterSidebarProps {
  className?: string;
}

export default function FilterSidebar({ className }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const categories = [
    { name: "Ready to Wear", count: 124 },
    { name: "Work & Institutional", count: 45 },
    { name: "Copeland Label", count: 12 },
    { name: "Fabric & Textiles", count: 89 },
  ];

  const subCategories = [
    { name: "Women", count: 56 },
    { name: "Men", count: 42 },
    { name: "Kids", count: 26 },
    { name: "Accessories", count: 18 },
  ];

  return (
    <aside className={cn("flex flex-col gap-8", className)}>
      {/* Search Filter Header (Mobile) */}
      <div className="flex items-center justify-between lg:hidden">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <FilterIcon className="h-5 w-5" /> Filters
        </h2>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
          Browse Categories
        </h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.name}>
              <button className="flex w-full items-center justify-between text-sm font-semibold text-ink-soft transition-colors hover:text-gold-700">
                {cat.name}
                <span className="text-[0.7rem] text-ink-faint">{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sub-categories */}
      <div>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
          Sub-categories
        </h3>
        <ul className="space-y-2">
          {subCategories.map((sub) => (
            <li key={sub.name}>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-line text-gold-600 focus:ring-gold-500"
                />
                <span className="text-sm font-medium text-ink-soft">{sub.name}</span>
                <span className="ml-auto text-[0.7rem] text-ink-faint">{sub.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
          Price Range (₦)
        </h3>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="200000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-gold-600"
          />
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-ink">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
          Customer Rating
        </h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((stars) => (
            <label key={stars} className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line text-gold-600 focus:ring-gold-500"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "text-xs",
                      i < stars ? "text-gold-500" : "text-ink-faint"
                    )}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-1 text-[0.7rem] text-ink-faint">& above</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons (Mobile) */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
        <button className="rounded-full border border-line py-2.5 text-xs font-bold text-ink">
          Reset
        </button>
        <button className="rounded-full bg-ink py-2.5 text-xs font-bold text-white shadow-card">
          Apply Filters
        </button>
      </div>
    </aside>
  );
}
