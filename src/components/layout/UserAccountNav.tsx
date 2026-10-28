"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRightIcon,
  BagIcon,
  ChevronDownIcon,
  GridIcon,
  LogOutIcon,
  PackageIcon,
  UserIcon,
} from "@/components/ui/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuth, signOut } from "@/store/slices/authSlice";
import { ROLE_HOME } from "@/types/auth";
import { cn } from "@/utils/cn";

export default function UserAccountNav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector(selectAuth);
  const [open, setOpen] = useState(false);

  if (status !== "authenticated" || !user) {
    return (
      <Link
        href="/login"
        aria-label="Sign in"
        className="flex min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-md text-ink transition-all duration-fast hover:bg-mist hover:text-gold-700"
      >
        <UserIcon className="h-5 w-5" />
      </Link>
    );
  }

  const initials = user.name?.trim().charAt(0).toUpperCase() || "U";
  const dashboardHref = ROLE_HOME[user.role];

  async function handleSignOut() {
    await dispatch(signOut());
    router.replace("/");
  }

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-full p-1 transition-all duration-fast hover:bg-mist focus-visible:ring-2 focus-visible:ring-gold"
      >
        {user.image ? (
          <img src={user.image} alt={user.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-line" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy font-serif text-sm font-bold text-gold-200 ring-1 ring-gold/30">
            {initials}
          </span>
        )}
        <ChevronDownIcon className={cn("h-3.5 w-3.5 text-ink-faint transition-transform duration-base", open && "rotate-180")} />
      </button>

      {/* Dropdown - using conditional rendering for better reliability */}
      {open && (
        <div className="absolute right-0 top-full z-[100] pt-2 animate-in fade-in slide-in-from-top-2 duration-base">
          <div className="w-60 overflow-hidden rounded-xl border border-line bg-paper shadow-overlay">
            <div className="border-b border-line px-4 py-3 bg-mist/30">
              <p className="truncate text-sm font-bold text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-faint font-medium">{user.email}</p>
            </div>

            <div className="p-1.5">
              <Link
                href={dashboardHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-ink transition-all duration-fast hover:bg-mist hover:text-gold-700"
              >
                <GridIcon className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-ink transition-all duration-fast hover:bg-mist hover:text-gold-700"
              >
                <PackageIcon className="h-4 w-4" />
                My Orders
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-ink transition-all duration-fast hover:bg-mist hover:text-gold-700"
              >
                <BagIcon className="h-4 w-4" />
                View Cart
              </Link>
            </div>

            <div className="border-t border-line p-1.5">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-danger transition-all duration-fast hover:bg-danger-soft"
              >
                <LogOutIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
