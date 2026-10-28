/** The API stores money in the smallest unit (kobo). 150000 -> "₦1,500.00". Display only, never for maths. */
export function formatMinor(amountMinor: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(amountMinor / 100);
}

/** Same as formatMinor, but tolerates the number-or-string kobo fields some endpoints return. */
export function formatMinorFlexible(amountMinor: number | string | null | undefined, currency = "NGN"): string {
  const n = typeof amountMinor === "string" ? Number(amountMinor) : amountMinor;
  return typeof n === "number" && Number.isFinite(n) ? formatMinor(n, currency) : "—";
}

export function formatDate(value: string | number | Date, withTime = false): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
  }).format(new Date(value));
}
