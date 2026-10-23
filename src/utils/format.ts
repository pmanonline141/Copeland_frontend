/** The API stores money in the smallest unit (kobo). 150000 -> "₦1,500.00". Display only, never for maths. */
export function formatMinor(amountMinor: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(amountMinor / 100);
}

export function formatDate(value: string | number | Date, withTime = false): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
  }).format(new Date(value));
}
