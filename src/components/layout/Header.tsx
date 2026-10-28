"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// A JPG import is an image object (not a component), so it is rendered with next/image below.
import logoPrimary from "@/assets/brand/Copeland_Logo_Primary.jpg";
import UserAccountNav from "./UserAccountNav";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BagIcon,
  ChevronDownIcon,
  CloseIcon,
  GlobeIcon,
  GridIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserIcon,
} from "@/components/ui/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuth, signOut } from "@/store/slices/authSlice";
import { selectCartCount } from "@/store/slices/cartSlice";
import { selectCartOpen, setCartOpen } from "@/store/slices/uiSlice";
import { ROLE_HOME } from "@/types/auth";
import { cn } from "@/utils/cn";
import { imageUrl } from "@/utils/image";
import CartDrawer from "./CartDrawer";

type NavLink = { href: string; label: string; desc?: string };
type MenuItem = {
  label: string;
  href?: string;
  /** Route prefix used to mark this entry as the current section (gold underline stays on). */
  base: string;
  columns?: { title: string; links: NavLink[] }[];
  promo?: { eyebrow: string; title: string; body: string; href: string; cta: string; image: string };
};

const MENU: MenuItem[] = [
  {
    label: "Shop",
    base: "/shop",
    columns: [
      {
        title: "Ready to wear",
        links: [
          { href: "/shop?category=women", label: "Women" },
          { href: "/shop?category=men", label: "Men" },
          { href: "/shop?category=kids", label: "Kids" },
          { href: "/shop?category=accessories", label: "Accessories" },
        ],
      },
      {
        title: "Work & institutional",
        links: [
          { href: "/shop?category=uniforms", label: "Uniforms & workwear" },
          { href: "/shop?category=scrubs", label: "Medical & scrubs" },
          { href: "/shop?category=ppe", label: "Safety & PPE" },
          { href: "/shop?category=hospitality", label: "Hospitality" },
        ],
      },
      {
        title: "By source",
        links: [
          { href: "/copeland", label: "Copeland label", desc: "Backed by us" },
          { href: "/shop?badge=true", label: "Badged listings" },
          { href: "/shop?category=fabric", label: "Fabric & textiles" },
          { href: "/shop?sort=new", label: "New arrivals" },
        ],
      },
    ],
    promo: {
      eyebrow: "Copeland · Luxury tier",
      title: "Tailored essentials",
      body: "Few styles, higher specifications, controlled pricing.",
      href: "/copeland",
      cta: "Explore the label",
      image: imageUrl("editorial fashion photograph of a folded tailored black shirt with gold trim on a soft ivory backdrop, luxury minimal styling, soft daylight, high detail", "portrait_4_3"),
    },
  },
  {
    label: "Copeland label",
    base: "/copeland",
    columns: [
      {
        title: "Tiers",
        links: [
          { href: "/copeland?tier=luxury", label: "Luxury", desc: "Live now" },
          { href: "/copeland?tier=premium", label: "Premium", desc: "Coming soon" },
          { href: "/copeland?tier=standard", label: "Standard", desc: "Coming soon" },
        ],
      },
      {
        title: "The promise",
        links: [
          { href: "/about/standards", label: "Quality standards" },
          { href: "/about/badge", label: "What the badge means" },
          { href: "/returns", label: "Returns & disputes" },
          { href: "/track", label: "Track an order" },
        ],
      },
    ],
  },
  {
    label: "Bulk & institutions",
    base: "/rfq",
    columns: [
      {
        title: "Buying in volume",
        links: [
          { href: "/rfq", label: "Request a quote (RFQ)" },
          { href: "/rfq?type=uniform", label: "Staff uniform programmes" },
          { href: "/rfq?type=school", label: "Schools & associations" },
          { href: "/rfq?type=gov", label: "Government & NGO" },
        ],
      },
      {
        title: "Support",
        links: [
          { href: "/contact", label: "Talk to our team" },
          { href: "/about/fulfilment", label: "Fulfilment & lead times" },
          { href: "/about/payments", label: "Payments & invoicing" },
        ],
      },
    ],
  },
  { label: "Sell with us", href: "/partners/apply", base: "/partners" },
];

/**
 * Shared look for the desktop top-level links: small caps with wide tracking (the premium-store
 * convention), same colours and hover colour as before. The gold underline is drawn by <NavUnderline />.
 */
const NAV_LINK =
  "relative flex items-center gap-1.5 px-3.5 py-2.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-ink-soft transition-colors duration-fast hover:text-gold-700 group-hover:text-gold-700";

/** Gold underline that slides in from the left on hover and stays on for the current section. */
function NavUnderline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-3.5 bottom-1 h-0.5 origin-left rounded-full bg-gold transition-transform duration-base ease-out-soft",
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
      )}
    />
  );
}

const ANNOUNCEMENTS = [
  { text: "Now onboarding verified suppliers and shipping partners.", cta: "Apply", href: "/partners/apply" },
  { text: "The Copeland badge: reviewed, approved, and backed by Copeland.", cta: "What it means", href: "/about/badge" },
  { text: "Bulk orders and institutional uniform programmes welcome.", cta: "Request a quote", href: "/rfq" },
];

/** Where a top-level menu entry points on the mobile list (dropdowns fall back to their first link). */
const menuHref = (item: MenuItem) => item.href ?? item.columns?.[0]?.links?.[0]?.href ?? "/shop";

function SearchForm({ className, id = "site-search" }: { className?: string; id?: string }) {
  // A plain GET form: works without JavaScript and lands on /search?q=...
  return (
    <form action="/search" method="get" role="search" className={cn("group relative", className)}>
      <label htmlFor={id} className="sr-only">Search garments</label>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint transition-colors group-focus-within:text-gold-600" />
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Search garments..."
        className="min-h-[2.5rem] w-full rounded-full border border-line bg-white pl-9 pr-10 text-sm font-semibold placeholder:text-ink-faint transition-all duration-fast focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-faint transition-all hover:bg-mist hover:text-gold-700 active:scale-95"
      >
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}

function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 5200);
    return () => window.clearInterval(t);
  }, []);
  const item = ANNOUNCEMENTS[index]!;
  return (
    <div className="bg-navy text-white">
      <div className="container flex items-center justify-center gap-2.5 py-1.5 text-center text-xs tracking-wide sm:text-[0.8125rem]">
        <GlobeIcon className="hidden h-4 w-4 text-gold-300 sm:block" />
        <span key={index} className="animate-fade-in font-semibold text-white/80">{item.text}</span>
        <Link href={item.href} className="link-underline hidden shrink-0 items-center gap-1 font-bold text-gold-300 hover:text-gold-200 sm:inline-flex">
          {item.cta} <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const cartOpen = useAppSelector(selectCartOpen);
  const count = useAppSelector(selectCartCount);
  const pathname = usePathname();
  const isActive = (item: MenuItem) => pathname === item.base || pathname.startsWith(`${item.base}/`);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white">
        Skip to content
      </a>

      <AnnouncementBar />

      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-ivory/85 backdrop-blur transition-shadow duration-base ease-out-soft supports-[backdrop-filter]:bg-ivory/75",
          scrolled ? "border-line shadow-card" : "border-transparent",
        )}
      >
        {/* Mobile: unchanged flex row. Desktop: 3 zones (logo | centred nav | actions) so the menu is truly centred. */}
        <div className="container flex h-14 items-center justify-between gap-4 lg:grid lg:h-16 lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" aria-label="Copeland Clothiers, home" className="shrink-0 justify-self-start">
            {/* mix-blend-multiply drops the logo's pale box into the ivory header; contrast/saturate make the thin gold + ink strokes read bolder */}
            <Image
              src={logoPrimary}
              alt="Copeland Clothiers"
              priority
              sizes="(min-width: 1024px) 200px, 140px"
              className="h-8 w-auto mix-blend-multiply contrast-[1.4] saturate-150 lg:h-12"
            />
          </Link>

          <nav aria-label="Main" className="hidden items-center justify-center lg:flex">
            {MENU.map((item) =>
              item.columns ? (
                <div key={item.label} className="group relative">
                  <button type="button" className={NAV_LINK} aria-haspopup="true">
                    {item.label}
                    <ChevronDownIcon className="h-3 w-3 transition-transform duration-base ease-out-soft group-hover:rotate-180" />
                    <NavUnderline active={isActive(item)} />
                  </button>

                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-base ease-out-soft group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div
                      className={cn(
                        "animate-menu-in overflow-hidden rounded-xl border border-line bg-paper shadow-overlay",
                        item.promo ? "w-[46rem]" : "w-[34rem]",
                      )}
                    >
                      <div className={cn("grid", item.promo ? "grid-cols-[1fr_14rem]" : "grid-cols-2")}>
                        <div className={cn("grid grid-cols-1 gap-6 p-6", item.promo ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
                          {item.columns.map((col) => (
                            <div key={col.title}>
                              <p className="border-b border-line pb-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-gold-700">{col.title}</p>
                              <ul className="mt-3 space-y-1">
                                {col.links.map((l) => (
                                  <li key={l.href + l.label}>
                                    <Link href={l.href} className="group/link flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-ink font-semibold transition-all duration-fast hover:bg-mist hover:text-gold-700">
                                      <span>
                                        {l.label}
                                        {l.desc && <span className="ml-2 text-xs text-ink-faint font-normal">{l.desc}</span>}
                                      </span>
                                      <ArrowRightIcon className="h-3.5 w-3.5 -translate-x-1 text-gold-600 opacity-0 transition-all duration-fast group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {item.promo && (
                          <Link href={item.promo.href} className="group/promo relative flex flex-col justify-end overflow-hidden bg-navy p-5 text-white">
                            <img src={item.promo.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-slow ease-out-soft group-hover/promo:scale-105" />
                            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
                            <span className="relative">
                              <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-gold-300">{item.promo.eyebrow}</span>
                              <span className="mt-1 block font-serif text-xl font-bold">{item.promo.title}</span>
                              <span className="mt-1 block text-xs text-white/70 font-medium">{item.promo.body}</span>
                              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-gold-300 group-hover/promo:text-white transition-colors">
                                {item.promo.cta} <ArrowUpRightIcon className="h-3.5 w-3.5" />
                              </span>
                            </span>
                          </Link>
                        )}
                      </div>

                      {/* Footer strip: one-click route to the whole section */}
                      <Link
                        href={menuHref(item)}
                        className="group/all flex items-center justify-between border-t border-line bg-mist/60 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink-soft transition-colors duration-fast hover:text-gold-700"
                      >
                        Browse all {item.label.toLowerCase()}
                        <ArrowRightIcon className="h-3.5 w-3.5 text-gold-600 transition-transform duration-fast group-hover/all:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={item.label} href={item.href ?? "/"} className={cn("group", NAV_LINK)}>
                  {item.label}
                  <NavUnderline active={isActive(item)} />
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1 lg:justify-self-end">
            {/* Search grows when focused (desktop only) */}
            <SearchForm className="hidden w-48 transition-[width] duration-base ease-out-soft focus-within:w-64 lg:block xl:w-56 xl:focus-within:w-72" />
            <span aria-hidden className="mx-2 hidden h-6 w-px bg-line lg:block" />
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-label={searchOpen ? "Hide search" : "Show search"}
              className="flex min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-md text-ink transition-all duration-fast hover:bg-mist hover:text-gold-700 lg:hidden"
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>
            
            <UserAccountNav />
            
            <button
              type="button"
              onClick={() => dispatch(setCartOpen(true))}
              aria-label={mounted ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
              className="relative flex min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-md text-ink transition-all duration-fast hover:bg-mist hover:text-gold-700 lg:rounded-full"
            >
              <BagIcon />
              {mounted && count > 0 && (
                <span className="absolute right-1 top-1 flex h-5 min-w-5 animate-fade-in items-center justify-center rounded-full bg-gold px-1 text-[0.7rem] font-bold leading-none text-ink ring-2 ring-ivory">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="flex min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-md text-ink transition-all duration-fast hover:bg-mist hover:text-gold-700 lg:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Search panel for tablet and below (the inline field covers lg and up). */}
        {searchOpen && (
          <div className="animate-fade-in border-t border-line bg-paper lg:hidden">
            <div className="container py-3">
              <SearchForm id="site-search-panel" />
            </div>
          </div>
        )}
      </header>

      {/* Mobile / tablet drawer */}
      <div className={cn("fixed inset-0 z-[60] lg:hidden", open ? "" : "pointer-events-none")} aria-hidden={!open}>
        <div
          className={cn("absolute inset-0 bg-navy/50 backdrop-blur-sm transition-opacity duration-base", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <aside
          id="mobile-menu"
          className={cn("absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-ivory shadow-overlay", open ? "animate-drawer-in" : "translate-x-full")}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <Image
              src={logoPrimary}
              alt="Copeland Clothiers"
              sizes="160px"
              className="h-9 w-auto mix-blend-multiply contrast-[1.4] saturate-150"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex min-h-touch min-w-touch items-center justify-center rounded-md text-ink transition-colors duration-fast hover:bg-mist"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <SearchForm id="site-search-mobile" />

            <nav aria-label="Mobile" className="mt-5 flex flex-col">
              {MENU.map((item) => (
                <Link
                  key={item.label}
                  href={menuHref(item)}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[3.5rem] items-center justify-between border-b border-line text-base font-bold text-ink transition-colors hover:text-gold-700"
                >
                  {item.label}
                  <ArrowRightIcon className="h-4 w-4 text-gold-600" />
                </Link>
              ))}
            </nav>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-2 rounded-xl border border-line bg-paper p-5 shadow-card">
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <ShieldCheckIcon className="h-4 w-4 text-gold-600" /> The Copeland badge
                </p>
                <p className="text-xs leading-relaxed text-ink-soft font-medium">
                  Reviewed, approved, and backed by Copeland for quality, fit and delivery.
                </p>
                <Link
                  href="/about/badge"
                  onClick={() => setOpen(false)}
                  className="mt-1 inline-block text-xs font-bold text-gold-700 hover:text-gold-800"
                >
                  What it means →
                </Link>
              </div>
              
              <div className="flex items-center gap-2 px-1 text-xs font-bold text-ink-faint">
                <TruckIcon className="h-4 w-4" /> Nationwide and cross-border delivery
              </div>
            </div>
          </div>

          {/* Mobile Auth Footer */}
          <div className="border-t border-line bg-mist/30 p-5">
            <UserAccountNavMobile />
          </div>
        </aside>
      </div>

      <CartDrawer open={cartOpen} onClose={() => dispatch(setCartOpen(false))} />
    </>
  );
}

function UserAccountNavMobile() {
  const { user, status } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  if (status !== "authenticated" || !user) {
    return (
      <Link
        href="/login"
        className="flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-bold text-white shadow-card transition-all active:scale-[0.98]"
      >
        <UserIcon className="h-4 w-4" />
        Sign in to your account
      </Link>
    );
  }

  const initials = user.name?.trim().charAt(0).toUpperCase() || "U";
  const dashboardHref = ROLE_HOME[user.role];

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        {user.image ? (
          <img src={user.image} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/20" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-serif text-base font-bold text-gold-200 ring-2 ring-gold/30">
            {initials}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{user.name}</p>
          <p className="truncate text-xs text-ink-faint font-medium">{user.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={dashboardHref}
          className="flex min-h-[2.75rem] items-center justify-center gap-2 rounded-lg border border-line bg-white text-xs font-bold text-ink shadow-sm transition-all active:scale-[0.98]"
        >
          <GridIcon className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <button
          type="button"
          onClick={async () => {
            await dispatch(signOut());
            router.replace("/");
          }}
          className="flex min-h-[2.75rem] items-center justify-center gap-2 rounded-lg border border-danger/20 bg-danger-soft text-xs font-bold text-danger transition-all active:scale-[0.98]"
        >
          <LogOutIcon className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </div>
  );
}