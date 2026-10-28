"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/brand/Logo";
import {
  ArrowRightIcon,
  ClockIcon,
  CloseIcon,
  CreditCardIcon,
  GridIcon,
  MenuIcon,
  PackageIcon,
  SendIcon,
  StoreIcon,
  TagIcon,
  TruckIcon,
  UserIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuth, signOut } from "@/store/slices/authSlice";
import { ROLE_HOME, ROLE_LABEL, type Role } from "@/types/auth";
import { cn } from "@/utils/cn";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type NavItem = { id: string; label: string; Icon: IconType };
type NavSection = { title: string; items: NavItem[] };

/**
 * Sidebar nav per role. Every item is an in-page anchor on that role's dashboard,
 * so navigation never points at a page that does not exist yet.
 */
const NAV: Record<Role, NavSection[]> = {
  buyer: [
    {
      title: "Shopping",
      items: [
        { id: "overview", label: "Overview", Icon: GridIcon },
        { id: "orders", label: "Orders", Icon: PackageIcon },
        { id: "quotes", label: "Quote requests", Icon: SendIcon },
      ],
    },
    { title: "Account", items: [{ id: "details", label: "Your details", Icon: UserIcon }] },
  ],
  supplier: [
    {
      title: "Catalogue",
      items: [
        { id: "overview", label: "Overview", Icon: GridIcon },
        { id: "products", label: "Products", Icon: TagIcon },
        { id: "orders", label: "Orders", Icon: PackageIcon },
      ],
    },
    { title: "Finance", items: [{ id: "settlements", label: "Settlements", Icon: CreditCardIcon }] },
  ],
  shipping: [
    {
      title: "Delivery",
      items: [
        { id: "overview", label: "Overview", Icon: GridIcon },
        { id: "shipments", label: "Shipments", Icon: TruckIcon },
      ],
    },
  ],
  staff: [
    {
      title: "Marketplace",
      items: [
        { id: "overview", label: "Overview", Icon: GridIcon },
        { id: "review", label: "Review queue", Icon: TagIcon },
        { id: "orders", label: "Orders & RFQs", Icon: PackageIcon },
      ],
    },
    { title: "Network", items: [{ id: "partners", label: "Partners", Icon: UsersIcon }] },
  ],
  admin: [
    {
      title: "Marketplace",
      items: [
        { id: "overview", label: "Overview", Icon: GridIcon },
        { id: "review", label: "Review queue", Icon: TagIcon },
        { id: "orders", label: "Orders & RFQs", Icon: PackageIcon },
      ],
    },
    {
      title: "Network",
      items: [
        { id: "partners", label: "Partners", Icon: UsersIcon },
        { id: "payouts", label: "Payouts", Icon: CreditCardIcon },
      ],
    },
    { title: "Governance", items: [{ id: "audit", label: "Audit log", Icon: ClockIcon }] },
  ],
};

/** The dashboard chrome shared by every role: sidebar, mobile drawer and content area. */
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector(selectAuth);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("overview");
  const [signingOut, setSigningOut] = useState(false);

  const role = user?.role ?? null;
  const base = role ? ROLE_HOME[role] : "/";
  const sections = role ? NAV[role] : [];

  // Back to the top section whenever the role area changes.
  useEffect(() => {
    setActive("overview");
    setOpen(false);
  }, [pathname]);

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function onSignOut() {
    setSigningOut(true);
    await dispatch(signOut());
    router.replace("/");
  }

  const nav = (
    <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-5">
      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <p className="px-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40">{section.title}</p>
          <ul className="mt-2 space-y-0.5">
            {section.items.map(({ id, label, Icon }) => (
              <li key={id}>
                <Link
                  href={`${base}#${id}`}
                  onClick={() => {
                    setActive(id);
                    setOpen(false);
                  }}
                  aria-current={active === id ? "true" : undefined}
                  className={cn(
                    "flex min-h-[2.75rem] items-center gap-3 rounded-md px-3 text-sm font-bold transition-all duration-fast",
                    active === id ? "bg-white/10 text-white shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-gold-300",
                  )}
                >
                  <Icon className={cn("h-[1.15rem] w-[1.15rem]", active === id ? "text-gold-300" : "text-white/50")} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="px-3">
        <Link href="/" className="flex min-h-[2.5rem] items-center gap-3 rounded-md px-0 text-sm font-bold text-white/60 transition-all duration-fast hover:text-white">
          <StoreIcon className="h-[1.15rem] w-[1.15rem] text-white/50" />
          Back to the store
          <ArrowRightIcon className="h-3.5 w-3.5 transition-all duration-fast" />
        </Link>
      </div>
    </nav>
  );

  const userCard = (
    <div className="border-t border-white/10 p-4">
      {user ? (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 font-serif text-lg text-gold-200">
            {user.name?.trim().charAt(0).toUpperCase() || "C"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-white/50">{ROLE_LABEL[user.role]}</p>
          </div>
        </div>
      ) : (
        <div className="h-10 animate-pulse rounded-md bg-white/5" />
      )}

      <button
        type="button"
        onClick={onSignOut}
        disabled={signingOut || status !== "authenticated"}
        className="mt-3 flex min-h-[2.25rem] w-full items-center justify-center gap-2 rounded-md border border-white/15 text-xs font-semibold text-white/80 transition-colors duration-fast hover:border-gold hover:text-gold-200 disabled:opacity-50"
      >
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );

  return (
    <div className="min-h-dvh bg-ivory lg:grid lg:grid-cols-[17rem_1fr]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col bg-navy text-white lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Link href="/" aria-label="Copeland Clothiers, home">
            <Logo variant="reversed" className="h-8" />
          </Link>
        </div>
        {nav}
        {userCard}
      </aside>

      <div className="flex min-h-dvh flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-ivory/90 px-4 backdrop-blur lg:hidden">
          <Link href="/" aria-label="Copeland Clothiers, home">
            <Logo className="h-8" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open dashboard menu"
            aria-controls="dashboard-menu"
            aria-expanded={open}
            className="flex min-h-touch min-w-touch items-center justify-center rounded-md text-ink transition-colors duration-fast hover:bg-mist"
          >
            <MenuIcon />
          </button>
        </header>

        <main id="main" className="flex-1 px-5 py-7 sm:px-7 lg:px-9 lg:py-9">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-[60] lg:hidden", open ? "" : "pointer-events-none")} aria-hidden={!open}>
        <div
          className={cn("absolute inset-0 bg-navy/50 backdrop-blur-sm transition-opacity duration-base", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <aside
          id="dashboard-menu"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[86%] max-w-xs flex-col bg-navy text-white shadow-overlay transition-transform duration-slow ease-out-soft",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <Logo variant="reversed" className="h-8" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close dashboard menu"
              className="flex min-h-touch min-w-touch items-center justify-center rounded-md text-white/80 transition-colors duration-fast hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>
          {nav}
          {userCard}
        </aside>
      </div>
    </div>
  );
}
