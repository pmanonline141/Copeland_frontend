"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectAuth } from "@/store/slices/authSlice";
import { ROLE_HOME, type Role } from "@/types/auth";

/**
 * Guard for protected pages. Redirects to /login (with ?next=) when signed out,
 * and to the user's own dashboard when their role is not allowed.
 *
 *   const { ready } = useRequireAuth(["supplier"]);
 *   if (!ready) return <Spinner />;
 *
 * Remember: "supplier"/"shipping" also need an APPROVED partner account; a 403 from the API
 * means "pending approval", so show a message instead of retrying.
 */
export function useRequireAuth(roles?: Role[]) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user } = useAppSelector(selectAuth);
  const key = roles?.join(",") ?? "";
  const allowed = status === "authenticated" && !!user && (!roles || roles.includes(user.role));

  useEffect(() => {
    if (status === "unauthenticated") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (status === "authenticated" && user && !allowed) router.replace(ROLE_HOME[user.role]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user?.role, allowed, key, pathname, router]);

  return { ready: allowed, resolving: status === "idle" || status === "loading", user };
}
