import type { PillTone } from "@/components/ui/Badge";

/** Maps an API status string to a badge tone, so statuses look the same everywhere. */
const TONES: Record<string, PillTone> = {
  // done / good
  live: "success",
  approved: "success",
  active: "success",
  delivered: "success",
  paid: "success",
  completed: "success",
  resolved: "success",
  // waiting on someone
  pending: "warning",
  submitted: "warning",
  in_review: "warning",
  processing: "warning",
  quoted: "warning",
  requires_review: "warning",
  // in motion
  packed: "info",
  picked_up: "info",
  in_transit: "info",
  customs: "info",
  out_for_delivery: "info",
  shipped: "info",
  // quiet
  draft: "neutral",
  paused: "neutral",
  closed: "neutral",
  cancelled: "neutral",
  // problems
  rejected: "danger",
  declined: "danger",
  failed: "danger",
  suspended: "danger",
  changes_requested: "danger",
};

export function statusTone(status?: string | null): PillTone {
  return (status ? TONES[status.toLowerCase()] : undefined) ?? "neutral";
}

/** "changes_requested" -> "Changes requested"; nullish -> an em dash. */
export function humanize(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

/** Renders a possibly-unknown analytics value without pretending to know its shape. */
export function displayUnknown(value: unknown): string {
  if (typeof value === "number") return Number.isFinite(value) ? value.toLocaleString("en-NG") : "—";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.length.toLocaleString("en-NG");
  return "—";
}
