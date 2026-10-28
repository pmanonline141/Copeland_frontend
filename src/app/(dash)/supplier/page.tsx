"use client";
import Link from "next/link";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import PageHeader, { HeaderAction } from "@/components/dashboard/PageHeader";
import Panel from "@/components/dashboard/Panel";
import QueryState from "@/components/dashboard/QueryState";
import StatCard from "@/components/dashboard/StatCard";
import { Pill } from "@/components/ui/Badge";
import { btn } from "@/components/ui/button";
import { CreditCardIcon, PackageIcon, TagIcon, TruckIcon } from "@/components/ui/icons";
import { useAsync } from "@/hooks/useAsync";
import { ordersService } from "@/services/orders.service";
import { productsService } from "@/services/products.service";
import { settlementsService } from "@/services/settlements.service";
import type { LedgerEntry } from "@/types/admin";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import { formatDate, formatMinorFlexible } from "@/utils/format";
import { humanize, statusTone } from "@/utils/status";

/** Readable order reference from whichever identifier the API sent; "—" when there is none. */
function orderRef(o: Order): string {
  const r = o as Order & { orderId?: string };
  if (r.orderNumber) return r.orderNumber;
  const id = r.id ?? r.orderId;
  return typeof id === "string" && id ? id.slice(0, 8) : "—";
}

/** Stable React key even if the response has no `id`. */
function orderKey(o: Order, i: number): string {
  const r = o as Order & { orderId?: string };
  return r.id ?? r.orderId ?? r.orderNumber ?? `order-${i}`;
}

export default function SupplierPage() {
  return (
    <DashboardGuard roles={["supplier"]}>
      <SupplierDashboard />
    </DashboardGuard>
  );
}

function SupplierDashboard() {
  const products = useAsync(() => productsService.mine(), []);
  const orders = useAsync(() => ordersService.supplierOrders(), []);
  const statement = useAsync(() => settlementsService.myStatement(), []);

  const productList = products.data ?? [];
  const orderList = orders.data ?? [];
  const entries = statement.data?.entries ?? [];

  const liveCount = productList.filter((p) => p.status === "live").length;
  const awaitingCount = productList.filter((p) => p.status === "submitted" || p.status === "changes_requested").length;

  const productCols: Column<Product>[] = [
    {
      key: "name",
      header: "Product",
      cell: (p) => (
        <span className="block">
          <span className="block max-w-[18rem] truncate font-medium text-ink">{p.name}</span>
          <span className="block text-xs text-ink-faint">{humanize(p.category)}</span>
        </span>
      ),
    },
    { key: "price", header: "Price", align: "right", cell: (p) => formatMinorFlexible(p.priceKobo) },
    { key: "stock", header: "Available", align: "right", cell: (p) => (typeof p.quantityAvailable === "number" ? p.quantityAvailable.toLocaleString("en-NG") : "—") },
    { key: "status", header: "Status", cell: (p) => <Pill tone={statusTone(p.status)}>{humanize(p.status)}</Pill> },
  ];

  const orderCols: Column<Order>[] = [
    // The supplier orders response may not carry `id` / `orderNumber` under those names, so never call methods on them unguarded.
    { key: "number", header: "Order", cell: (o) => <span className="font-medium text-ink">{orderRef(o)}</span> },
    { key: "items", header: "Items", align: "right", cell: (o) => o.items?.length ?? 0 },
    { key: "total", header: "Total", align: "right", cell: (o) => formatMinorFlexible(o.totalKobo) },
    { key: "status", header: "Status", cell: (o) => <Pill tone={statusTone(o.status)}>{humanize(o.status)}</Pill> },
    { key: "created", header: "Placed", cell: (o) => (o.createdAt ? formatDate(o.createdAt) : "—") },
  ];

  const entryCols: Column<LedgerEntry>[] = [
    { key: "date", header: "Date", cell: (e) => (e.createdAt ? formatDate(e.createdAt) : "—") },
    { key: "note", header: "Note", cell: (e) => <span className="block max-w-[20rem] truncate">{e.note ?? "—"}</span> },
    { key: "amount", header: "Amount", align: "right", cell: (e) => formatMinorFlexible(e.amountKobo) },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Supplier dashboard"
        title="Your catalogue and orders"
        description="Manage your products, keep fulfilment up to date and follow your settlements."
        actions={<HeaderAction href="/supplier/products/new">Upload new product</HeaderAction>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={productList.length} hint={`${liveCount} live`} Icon={TagIcon} tone="gold" loading={products.loading} />
        <StatCard label="Awaiting review" value={awaitingCount} hint="Submitted or needing changes" Icon={TruckIcon} tone={awaitingCount > 0 ? "warning" : "default"} loading={products.loading} />
        <StatCard label="Orders assigned" value={orderList.length} hint="Allocation from Copeland" Icon={PackageIcon} loading={orders.loading} />
        <StatCard label="Balance" value={formatMinorFlexible(statement.data?.balanceKobo)} hint="Across your ledger" Icon={CreditCardIcon} tone="navy" loading={statement.loading} />
      </div>

      <section id="products" className="mt-6 scroll-mt-24">
        <Panel title="Your products" description="Every listing is moderated by Copeland before it goes live." bodyClassName="p-0 pt-1">
          <QueryState
            loading={products.loading}
            error={products.error}
            onRetry={products.reload}
            isEmpty={productList.length === 0}
            emptyTitle="No products yet"
            emptyBody="Add your first product to the catalogue. Once submitted, it will be reviewed by Copeland before it goes live."
            emptyAction={<Link href="/supplier/products/new" className={btn("primary", "sm")}>Upload your first product</Link>}
          >
            <DataTable columns={productCols} rows={productList} getRowKey={(p) => p.id} caption="Your products" />
          </QueryState>
        </Panel>
      </section>

      <section id="orders" className="mt-6 scroll-mt-24">
        <Panel title="Orders assigned to you" description="Update fulfilment as each line moves." bodyClassName="p-0 pt-1">
          <QueryState
            loading={orders.loading}
            error={orders.error}
            onRetry={orders.reload}
            isEmpty={orderList.length === 0}
            emptyTitle="No orders assigned"
            emptyBody="When Copeland allocates an order to you, it appears here with the buyer's items and your fulfilment status."
          >
            <DataTable columns={orderCols} rows={orderList} getRowKey={(o, i) => orderKey(o, i)} caption="Orders assigned to you" />
          </QueryState>
        </Panel>
      </section>

      <section id="settlements" className="mt-6 scroll-mt-24">
        <Panel
          title="Settlements"
          description="Your ledger entries and current balance."
          action={<span className="font-serif text-lg text-ink">{formatMinorFlexible(statement.data?.balanceKobo)}</span>}
          bodyClassName="p-0 pt-1"
        >
          <QueryState
            loading={statement.loading}
            error={statement.error}
            onRetry={statement.reload}
            isEmpty={entries.length === 0}
            emptyTitle="No ledger entries yet"
            emptyBody="Sales, commission deductions and payouts will show up here once orders are settled."
            skeleton={
              <div className="space-y-3 p-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 w-full animate-shimmer rounded-md bg-shimmer bg-[length:200%_100%]" />
                ))}
              </div>
            }
          >
            <DataTable columns={entryCols} rows={entries} getRowKey={(e, i) => e.id ?? `entry-${i}`} caption="Settlement entries" />
          </QueryState>
        </Panel>
      </section>
    </>
  );
}