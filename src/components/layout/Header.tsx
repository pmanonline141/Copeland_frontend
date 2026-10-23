"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/brand/Logo";
import { ArrowRightIcon, BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { useAppSelector } from "@/store/hooks";
import { selectAuth } from "@/store/slices/authSlice";
import { selectCartCount } from "@/store/slices/cartSlice";
import { ROLE_HOME } from "@/types/auth";
import { cn } from "@/utils/cn";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/copeland", label: "Copeland label" },
  { href: "/rfq", label: "Bulk & institutions" },
  { href: "/partners/apply", label: "Sell with us" },
];

function SearchForm({ className }: { className?: string }) {
  // A plain GET form: works without JavaScript and lands on /shop?q=...
  return (
    <form action="/shop" method="get" role="search" className={cn("relative", className)}>
      <label htmlFor="site-search" className="sr-only">Search garments</label>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      <input
        id="site-search" name="q" type="search" placeholder="Search garments"
        className="min-h-touch w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm placeholder:text-ink-faint focus:border-gold"
      />
    </form>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const count = useAppSelector(selectCartCount);
  const { status, user } = useAppSelector(selectAuth);
  const accountHref = status === "authenticated" && user ? ROLE_HOME[user.role] : "/login";
  const accountLabel = status === "authenticated" ? "My account" : "Sign in";

  return (
    <>
      {/* Announcement bar (scrolls away; the header below stays) */}
      <div className="bg-navy text-white">
        <div className="container flex items-center justify-center gap-2 py-2 text-xs sm:text-sm">
          <span className="text-white/80">Now onboarding verified suppliers and shipping partners.</span>
          <Link href="/partners/apply" className="inline-flex items-center gap-1 font-semibold text-gold-300 hover:text-gold-200">
            Apply <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
        <div className="container flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Link href="/" aria-label="Copeland Clothiers, home" className="shrink-0">
            <Logo className="h-9 lg:h-11" />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm font-medium text-ink-soft transition-colors duration-fast hover:text-ink">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <SearchForm className="hidden w-56 xl:block" />
            <Link href="/shop" aria-label="Search" className="btn-icon flex min-h-touch min-w-touch items-center justify-center rounded-md text-ink hover:bg-mist xl:hidden">
              <SearchIcon />
            </Link>
            <Link href={accountHref} aria-label={accountLabel} className="hidden min-h-touch min-w-touch items-center justify-center rounded-md text-ink hover:bg-mist sm:flex">
              <UserIcon />
            </Link>
            <Link href="/cart" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`} className="relative flex min-h-touch min-w-touch items-center justify-center rounded-md text-ink hover:bg-mist">
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.7rem] font-semibold leading-none text-ink">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
            <button
              type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}
              className="flex min-h-touch min-w-touch items-center justify-center rounded-md text-ink hover:bg-mist lg:hidden"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div id="mobile-menu" className="animate-fade-in border-t border-line bg-ivory lg:hidden">
            <div className="container space-y-4 py-4">
              <SearchForm />
              <nav aria-label="Mobile" className="flex flex-col">
                {NAV.map((n) => (
                  <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex min-h-touch items-center justify-between border-b border-line text-base font-medium text-ink">
                    {n.label} <ArrowRightIcon className="h-4 w-4 text-gold-600" />
                  </Link>
                ))}
                <Link href={accountHref} onClick={() => setOpen(false)} className="flex min-h-touch items-center gap-2 text-base font-medium text-ink">
                  <UserIcon className="h-5 w-5" /> {accountLabel}
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
