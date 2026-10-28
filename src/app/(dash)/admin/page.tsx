"use client";
import Link from "next/link";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DataTable from "@/components/dashboard/DataTable";
import PageHeader from "@/components/dashboard/PageHeader";
import Panel from "@/components/dashboard/Panel";
import QueryState from "@/components/dashboard/QueryState";
import StatCard from "@/components/dashboard/StatCard";
import { Pill } from "@/components/ui/Badge";
import { AlertIcon, ClockIcon, CreditCardIcon, SendIcon, TagIcon, UsersIcon } from "@/components/ui/icons";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/admin.service";
import { partnersService } from "@/services/partners.service";
import { rfqsService } from "@/services/rfqs.service";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/authSlice";
import type { AuditEntry, PayoutItem } from "@/types/admin";
import type { Order } from "@/types/order";
import type { Partner } from "@/types/partner";
import type { Product } from "@/types/product";
import type { RfqCount } from "@/types/rfq";
import { formatDate, formatMinorFlexible } from "@/utils/format";
import { displayUnknown, humanize, statusTone } from "@/utils/status";

export default function AdminPage() {
  return (
    <DashboardGuard roles={["staff", "admin"]}>
      <AdminDashboard />
    </DashboardGuard>
  );
}

function AdminDashboard() {
  const user = useAppSelector(selectUser);
  const isAdmin = user?.role === "admin";

  const analytics = useAsync(() => adminService.analytics(), []);
  const review = useAsync(() => adminService.productsForReview(), []);
  const flagged = useAsync(() => adminService.flaggedOrders(), []);
  const partners = useAsync(() => partnersService.list(), []);
  const payouts = useAsync(() => adminService.payouts(), []);
  const rfqCounts = useAsync(() => rfqsService.counts(), []);
  // Admin-only: staff would get a 403, so skip the request for them.
  const audit = useAsync(() => (isAdmin ? adminService.auditLog(50) : Promise.resolve<AuditEntry[]>([])), [isAdmin]);

  const reviewList = review.data ?? [];
  const flaggedList = flagged.data ?? [];
  const partnerList = partners.data ?? [];
  const payoutList = payouts.data ?? [];
  const rfqList = rfqCounts.data ?? [];
  const auditList = audit.data ?? [];

  const pendingPartners = partnerList.filter((p) => p.status === "pending").length;

  return (
    <>
      <PageHeader
        eyebrow={isAdmin ? "Administrator dashboard" : "Copeland staff dashboard"}
        title={`${user?.name?.trim().split(/\s+/)[0] ?? "Welcome"} — marketplace operations`}
        description="Moderate listings, watch flagged orders and keep the partner network and settlement ledger in order."
      />

      <div id="overview" className="scroll-mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Awaiting review" value={reviewList.length} hint="Products in the moderation queue" Icon={TagIcon} tone="gold" loading={review.loading} />
        <StatCard label="Flagged orders" value={flaggedList.length} hint="Need a manual decision" Icon={AlertIcon} tone={flaggedList.length > 0 ? "danger" : "default"} loading={flagged.loading} />
        <StatCard label="Pending partners" value={pendingPartners} hint={`${partnerList.length} in total`} Icon={UsersIcon} tone="warning" loading={partners.loading} />
        <StatCard
          label="Commission earned"
          value={displayUnknown(analytics.data?.commissionEarned)}
          hint={`Pending payouts: ${displayUnknown(analytics.data?.pendingPayouts)}`}
          Icon={CreditCardIcon}
          tone="navy"
          loading={analytics.loading}
        />
      </div>

      <section id="review" className="mt-6 scroll-mt-24">
        <Panel title="Review queue" description="Every new listing is moderated before it can go live." bodyClassName="p-0 pt-1">
          <QueryState
            loading={review.loading}
            error={review.error}
            onRetry={review.reload}
            isEmpty={reviewList.length === 0}
            emptyTitle="The review queue is clear"
            emptyBody="No products are waiting for moderation right now."
            emptyAction={<span className="text-xs text-ink-faint">Supplier submissions land here first.</span>}
          >
            <DataTable
              caption="Products awaiting review"
              rows={reviewList}
              getRowKey={(p) => p.id}
              columns={[
                { key: "name", header: "Product", cell: (p: Product) => <span className="block max-w-[18rem] truncate font-medium text-ink">{p.name}</span> },
                { key: "category", header: "Category", cell: (p: Product) => humanize(p.category) },
                { key: "price", header: "Price", align: "right", cell: (p: Product) => formatMinorFlexible(p.priceKobo) },
                { key: "status", header: "Status", cell: (p: Product) => <Pill tone={statusTone(p.status)}>{humanize(p.status)}</Pill> },
              ]}
            />
          </QueryState>
        </Panel>
      </section>

      <section id="orders" className="mt-6 scroll-mt-24">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Panel title="Flagged orders" description="Orders the system could not clear automatically." bodyClassName="p-0 pt-1">
            <QueryState loading={flagged.loading} error={flagged.error} onRetry={flagged.reload} isEmpty={flaggedList.length === 0} emptyTitle="No flagged orders" emptyBody="Nothing needs a manual decision right now.">
              <DataTable
                caption="Flagged orders"
                rows={flaggedList}
                getRowKey={(o) => o.id}
                columns={[
                  { key: "number", header: "Order", cell: (o: Order) => <span className="font-medium text-ink">{o.orderNumber ?? o.id.slice(0, 8)}</span> },
                  { key: "total", header: "Total", align: "right", cell: (o: Order) => formatMinorFlexible(o.totalKobo) },
                  { key: "items", header: "Items", align: "right", cell: (o: Order) => o.items?.length ?? 0 },
                  { key: "status", header: "Status", cell: (o: Order) => <Pill tone={statusTone(o.status)}>{humanize(o.status)}</Pill> },
                ]}
              />
            </QueryState>
          </Panel>

          <Panel title="Quote requests" description="Open RFQs by status." bodyClassName="p-5">
            <QueryState loading={rfqCounts.loading} error={rfqCounts.error} onRetry={rfqCounts.reload} isEmpty={rfqList.length === 0} emptyTitle="No quote requests" emptyBody="Bulk enquiries will be counted here.">
              <ul className="space-y-3">
                {rfqList.map((c: RfqCount) => (
                  <li key={c.status} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-ink-soft">
                      <SendIcon className="h-4 w-4 text-ink-faint" />
                      {humanize(c.status)}
                    </span>
                    <span className="font-serif text-lg text-ink">{c.count.toLocaleString("en-NG")}</span>
                  </li>
                ))}
              </ul>
            </QueryState>
          </Panel>
        </div>
      </section>

      <section id="partners" className="mt-6 scroll-mt-24">
        <Panel title="Partner network" description="Suppliers and shipping partners applying to work with Copeland." bodyClassName="p-0 pt-1">
          <QueryState loading={partners.loading} error={partners.error} onRetry={partners.reload} isEmpty={partnerList.length === 0} emptyTitle="No partners yet" emptyBody="Applications land here for review.">
            <DataTable
              caption="Partners"
              rows={partnerList}
              getRowKey={(p) => p.id}
              columns={[
                { key: "name", header: "Business", cell: (p: Partner) => <span className="block max-w-[16rem] truncate font-medium text-ink">{p.businessName ?? p.companyName ?? p.id.slice(0, 8)}</span> },
                { key: "type", header: "Type", cell: (p: Partner) => humanize(p.partnerType) },
                { key: "status", header: "Status", cell: (p: Partner) => <Pill tone={statusTone(p.status)}>{humanize(p.status)}</Pill> },
                {
                  key: "actions",
                  header: "",
                  align: "right",
                  cell: (p: Partner) => (
                    <Link href={`/admin/partners/${p.id}`} className="text-xs font-semibold text-gold hover:underline">
                      Review details
                    </Link>
                  ),
                },
              ]}
            />
          </QueryState>
        </Panel>
      </section>

      <section id="payouts" className="mt-6 scroll-mt-24">
        <Panel title="Payouts" description="Settlement items waiting to be paid out to partners." bodyClassName="p-0 pt-1">
          <QueryState loading={payouts.loading} error={payouts.error} onRetry={payouts.reload} isEmpty={payoutList.length === 0} emptyTitle="No payouts queued" emptyBody="Approved settlement items will appear here.">
            <DataTable
              caption="Payouts"
              rows={payoutList}
              getRowKey={(p) => p.id}
              columns={[
                { key: "item", header: "Order item", cell: (p: PayoutItem) => <span className="font-mono text-xs">{p.orderItemId ? p.orderItemId.slice(0, 8) : p.id.slice(0, 8)}</span> },
                { key: "amount", header: "Amount", align: "right", cell: (p: PayoutItem) => formatMinorFlexible(p.amountKobo) },
                { key: "status", header: "Status", cell: (p: PayoutItem) => <Pill tone={statusTone(p.status)}>{humanize(p.status)}</Pill> },
              ]}
            />
          </QueryState>
        </Panel>
      </section>

      {isAdmin && (
        <section id="audit" className="mt-6 scroll-mt-24">
          <Panel title="Audit log" description="Recent actions recorded against the platform." bodyClassName="p-0 pt-1">
            <QueryState loading={audit.loading} error={audit.error} onRetry={audit.reload} isEmpty={auditList.length === 0} emptyTitle="No audit entries" emptyBody="Administrative actions will be recorded here.">
              <DataTable
                caption="Audit log"
                rows={auditList}
                getRowKey={(e, i) => e.id ?? `audit-${i}`}
                columns={[
                  { key: "date", header: "When", cell: (e: AuditEntry) => (e.createdAt ? formatDate(e.createdAt, true) : "—") },
                  { key: "action", header: "Action", cell: (e: AuditEntry) => (typeof e.action === "string" ? humanize(e.action) : "—") },
                  { key: "ref", header: "Reference", cell: (e: AuditEntry) => <span className="font-mono text-xs text-ink-faint">{typeof e.entityId === "string" ? e.entityId.slice(0, 12) : (e.id?.slice(0, 12) ?? "—")}</span> },
                  { key: "by", header: "By", cell: (e: AuditEntry) => (typeof e.actorId === "string" ? e.actorId.slice(0, 8) : "—") },
                ]}
              />
            </QueryState>
          </Panel>
        </section>
      )}

      <p className="mt-8 flex items-center gap-2 text-xs text-ink-faint">
        <ClockIcon className="h-3.5 w-3.5" />
        Signed in as {user?.email ?? "—"} ({user ? humanize(user.role) : "—"}).
      </p>
    </>
  );
}
