"use client";
import Link from "next/link";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import EmptyState from "@/components/dashboard/EmptyState";
import PageHeader, { HeaderAction } from "@/components/dashboard/PageHeader";
import Panel from "@/components/dashboard/Panel";
import StatCard from "@/components/dashboard/StatCard";
import { Pill } from "@/components/ui/Badge";
import { btn } from "@/components/ui/button";
import { BagIcon, CreditCardIcon, PackageIcon, SendIcon, UserIcon } from "@/components/ui/icons";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/authSlice";
import { selectCartCount, selectCartEstimateKobo, selectCartItems } from "@/store/slices/cartSlice";
import { ROLE_LABEL } from "@/types/auth";
import { formatMinor } from "@/utils/format";

export default function BuyerPage() {
  return (
    <DashboardGuard roles={["buyer"]}>
      <BuyerDashboard />
    </DashboardGuard>
  );
}

function BuyerDashboard() {
  const user = useAppSelector(selectUser);
  const count = useAppSelector(selectCartCount);
  const items = useAppSelector(selectCartItems);
  const estimate = useAppSelector(selectCartEstimateKobo);
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "there";

  return (
    <>
      <PageHeader
        eyebrow="Buyer dashboard"
        title={`Welcome back, ${firstName}`}
        description="Track your orders, manage quote requests and keep your account details up to date."
        actions={<HeaderAction href="/shop">Shop the catalogue</HeaderAction>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Items in cart" value={count} hint={count > 0 ? "Ready to check out" : "Your cart is empty"} Icon={BagIcon} tone="gold" />
        <StatCard label="Cart value" value={formatMinor(estimate)} hint="Estimate — confirmed at checkout" Icon={CreditCardIcon} />
        <StatCard label="Email" value={user?.emailVerified ? "Verified" : "Unverified"} hint={user?.email ?? ""} Icon={SendIcon} tone={user?.emailVerified ? "success" : "warning"} />
        <StatCard label="Account" value={user ? ROLE_LABEL[user.role] : "—"} hint="Signed in" Icon={UserIcon} tone="navy" />
      </div>

      {items.length > 0 && (
        <div className="mt-6">
          <Panel
            title="In your cart"
            description={`${count} item${count === 1 ? "" : "s"} waiting`}
            action={<Link href="/cart" className={btn("primary", "sm")}>Review cart</Link>}
          >
            <ul className="divide-y divide-line">
              {items.slice(0, 5).map((i) => (
                <li key={`${i.productId}-${i.size ?? ""}-${i.colour ?? ""}`} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{i.name ?? i.productId}</span>
                    <span className="block text-xs text-ink-faint">
                      Qty {i.quantity}
                      {i.size ? ` · Size ${i.size}` : ""}
                      {i.colour ? ` · ${i.colour}` : ""}
                    </span>
                  </span>
                  {typeof i.priceKobo === "number" && <span className="shrink-0 text-sm text-ink-soft">{formatMinor(i.priceKobo * i.quantity)}</span>}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      <section id="orders" className="mt-6 scroll-mt-24">
        <Panel title="Your orders" description="Everything you have bought through Copeland.">
          <EmptyState
            icon={<PackageIcon className="h-6 w-6" strokeWidth={1.5} />}
            title="No order history on this account yet"
            body="Placed an order as a guest, or before signing in? Look it up with your order number and email."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/track" className={btn("subtle", "sm")}>Track an order</Link>
                <Link href="/shop" className={btn("primary", "sm")}>Start shopping</Link>
              </div>
            }
          />
        </Panel>
      </section>

      <section id="quotes" className="mt-6 scroll-mt-24">
        <Panel
          title="Quote requests"
          description="Bulk and institutional buying works on quotes, not the cart."
          action={<Link href="/rfq" className={btn("subtle", "sm")}>Request a quote</Link>}
        >
          <p className="text-sm text-ink-soft">
            Buying for a team, school or firm? Send a request for quotation with your sizes, quantities and lead time. A
            Copeland specialist reviews it and comes back with a consolidated price — no chasing individual suppliers.
          </p>
        </Panel>
      </section>

      <section id="details" className="mt-6 scroll-mt-24">
        <Panel title="Your details">
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">Name</dt>
              <dd className="mt-1 text-sm text-ink">{user?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">Email</dt>
              <dd className="mt-1 text-sm text-ink">{user?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">Email verified</dt>
              <dd className="mt-1">
                <Pill tone={user?.emailVerified ? "success" : "warning"}>{user?.emailVerified ? "Verified" : "Not verified"}</Pill>
              </dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">Account type</dt>
              <dd className="mt-1 text-sm text-ink">{user ? ROLE_LABEL[user.role] : "—"}</dd>
            </div>
          </dl>
        </Panel>
      </section>
    </>
  );
}
