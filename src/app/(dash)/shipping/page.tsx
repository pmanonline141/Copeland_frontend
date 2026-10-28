"use client";
import { useState } from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import PageHeader from "@/components/dashboard/PageHeader";
import Panel from "@/components/dashboard/Panel";
import StatCard from "@/components/dashboard/StatCard";
import { Pill } from "@/components/ui/Badge";
import { btn } from "@/components/ui/button";
import { AlertIcon, CheckIcon, TruckIcon, UserIcon } from "@/components/ui/icons";
import { getErrorMessage } from "@/services/apiClient";
import { shippingService } from "@/services/shipping.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/authSlice";
import { showAlert } from "@/store/slices/uiSlice";
import { ROLE_LABEL } from "@/types/auth";
import type { Shipment, ShipmentStatus } from "@/types/shipping";
import { cn } from "@/utils/cn";
import { humanize, statusTone } from "@/utils/status";

const STATUSES: ShipmentStatus[] = ["picked_up", "in_transit", "delivered"];

const FIELD =
  "min-h-[2.5rem] w-full rounded-md border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-faint transition-colors duration-fast focus:border-gold";

export default function ShippingPage() {
  return (
    <DashboardGuard roles={["shipping"]}>
      <ShippingDashboard />
    </DashboardGuard>
  );
}

function ShippingDashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [rows, setRows] = useState<Shipment[]>([]);
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);

  const [shipmentId, setShipmentId] = useState("");
  const [status, setStatus] = useState<ShipmentStatus>("picked_up");
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);

  async function onRecord(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim() || !tracking.trim()) return;
    setSaving(true);
    try {
      const created = await shippingService.create({ orderId: orderId.trim(), trackingNumber: tracking.trim() });
      setRows((r) => [created, ...r]);
      setOrderId("");
      setTracking("");
      dispatch(showAlert({ kind: "success", message: "Shipment recorded." }));
    } catch (err) {
      dispatch(showAlert({ kind: "error", message: getErrorMessage(err) }));
    } finally {
      setSaving(false);
    }
  }

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!shipmentId.trim()) return;
    setUpdating(true);
    try {
      const updated = await shippingService.update(shipmentId.trim(), { status, ...(note.trim() ? { note: note.trim() } : {}) });
      setRows((r) => r.map((s) => (s.id === updated.id ? updated : s)));
      setNote("");
      dispatch(showAlert({ kind: "success", message: `Status set to ${humanize(status).toLowerCase()}.` }));
    } catch (err) {
      dispatch(showAlert({ kind: "error", message: getErrorMessage(err) }));
    } finally {
      setUpdating(false);
    }
  }

  const cols: Column<Shipment>[] = [
    { key: "tracking", header: "Tracking number", cell: (s) => <span className="font-medium text-ink">{s.trackingNumber ?? "—"}</span> },
    { key: "order", header: "Order", cell: (s) => <span className="font-mono text-xs">{s.orderId ? s.orderId.slice(0, 8) : "—"}</span> },
    { key: "status", header: "Status", cell: (s) => <Pill tone={statusTone(s.status)}>{humanize(s.status)}</Pill> },
    { key: "id", header: "Shipment id", cell: (s) => <span className="font-mono text-xs text-ink-faint">{s.id.slice(0, 8)}</span> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Shipping partner dashboard"
        title="Deliveries assigned to you"
        description="Record pickups, keep tracking numbers accurate and move each parcel through to delivery."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Account" value={user ? ROLE_LABEL[user.role] : "—"} hint="Signed in" Icon={UserIcon} tone="navy" />
        <StatCard label="Email" value={user?.emailVerified ? "Verified" : "Unverified"} hint={user?.email ?? ""} Icon={CheckIcon} tone={user?.emailVerified ? "success" : "warning"} />
        <StatCard label="Shipments recorded" value={rows.length} hint="In this session" Icon={TruckIcon} tone="gold" />
      </div>

      <section id="shipments" className="mt-6 scroll-mt-24">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Panel title="Record a shipment" description="Attach a tracking number to an order Copeland assigned to you.">
            <form onSubmit={onRecord} className="grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-ink-soft">Order ID</span>
                <input className={FIELD} value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g. 8f2c1a90-…" required />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-ink-soft">Tracking number</span>
                <input className={FIELD} value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Carrier or in-house reference" required />
              </label>
              <div>
                <button type="submit" className={btn("primary", "sm")} disabled={saving}>
                  {saving ? "Recording…" : "Record shipment"}
                </button>
              </div>
            </form>
          </Panel>

          <Panel title="Update a shipment" description="Move a recorded shipment to its next status.">
            <form onSubmit={onUpdate} className="grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-ink-soft">Shipment ID</span>
                <input className={FIELD} value={shipmentId} onChange={(e) => setShipmentId(e.target.value)} placeholder="Shipment id" required />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-ink-soft">Status</span>
                <select className={cn(FIELD, "cursor-pointer")} value={status} onChange={(e) => setStatus(e.target.value as ShipmentStatus)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {humanize(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-ink-soft">Note (optional)</span>
                <input className={FIELD} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything the buyer should know" />
              </label>
              <div>
                <button type="submit" className={btn("primary", "sm")} disabled={updating}>
                  {updating ? "Updating…" : "Update status"}
                </button>
              </div>
            </form>
          </Panel>
        </div>

        <div className="mt-6">
          <Panel title="Shipments recorded here" description="Copeland keeps the full delivery record on its side." bodyClassName="p-0 pt-1">
            {rows.length === 0 ? (
              <div className="flex items-start gap-3 px-5 py-6 text-sm text-ink-soft">
                <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
                <p>Shipments you record above appear here so you can update them without leaving the page.</p>
              </div>
            ) : (
              <DataTable columns={cols} rows={rows} getRowKey={(s) => s.id} caption="Shipments recorded in this session" />
            )}
          </Panel>
        </div>
      </section>
    </>
  );
}
