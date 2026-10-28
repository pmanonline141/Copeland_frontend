"use client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { Role } from "@/types/auth";

/**
 * Wraps a role dashboard page. Redirects signed-out visitors to /login and sends
 * a signed-in user with the wrong role to their own dashboard (see useRequireAuth).
 * Renders a calm skeleton while the session is still being resolved.
 */
export default function DashboardGuard({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { ready } = useRequireAuth(roles);
  if (!ready) return <DashboardSkeleton />;
  return <>{children}</>;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Loading your dashboard</span>
      <div className="h-8 w-56 animate-shimmer rounded-md bg-shimmer bg-[length:200%_100%]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-shimmer rounded-xl bg-shimmer bg-[length:200%_100%]" />
        ))}
      </div>
      <div className="h-64 animate-shimmer rounded-xl bg-shimmer bg-[length:200%_100%]" />
    </div>
  );
}
