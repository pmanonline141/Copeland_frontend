/** Safe wrappers around localStorage / sessionStorage (they can throw in private mode or be missing). */
type Kind = "local" | "session";
const get = (kind: Kind) => (typeof window === "undefined" ? null : kind === "local" ? window.localStorage : window.sessionStorage);

export function loadJSON<T>(kind: Kind, key: string): T | null {
  try {
    const raw = get(kind)?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Passing null/undefined removes the key. */
export function saveJSON(kind: Kind, key: string, value: unknown) {
  try {
    const s = get(kind);
    if (!s) return;
    if (value === null || value === undefined) s.removeItem(key);
    else s.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: persistence is best-effort */
  }
}

/** Never store the session token, passwords or payment secrets here. Cart and the pending order id only. */
export const STORAGE_KEYS = {
  cart: "copeland.cart.v1",
  pendingOrder: "copeland.pendingOrder.v1",
} as const;
