/**
 * The ONE place that talks to the Copeland API.
 * Feature services (products.service.ts, orders.service.ts ...) call `api.get/post/...`
 * and never use fetch directly, so auth cookies, errors and the base URL stay consistent.
 *
 *   const products = await api.get<Paginated<Product>>("/api/catalogue", { query: { page: 1 } });
 */
import type { ApiErrorBody } from "@/types/api";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const TIMEOUT_MS = 30_000;

/** Every failed request becomes one of these, with a message that is safe to show to a user. */
export class ApiError extends Error {
  constructor(
    public readonly status: number, // 0 = the server could not be reached
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | number | boolean | null | undefined>;

export interface RequestOptions {
  query?: Query;
  body?: unknown; // plain objects are sent as JSON; FormData is sent as-is
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Skip the global 401 handler (e.g. "who am I" checks, where 401 just means signed out). */
  skipUnauthorizedHandler?: boolean;
}

let unauthorizedHandler: (() => void) | null = null;
/** Register a callback that runs on any 401 (the future auth slice uses it to clear the session). */
export function setUnauthorizedHandler(fn: (() => void) | null) {
  unauthorizedHandler = fn;
}

function buildUrl(path: string, query?: Query): string {
  if (!BASE_URL) {
    throw new ApiError(0, "not_configured", "NEXT_PUBLIC_API_URL is not set. Add it to .env.local and restart.");
  }
  const url = new URL(path.startsWith("/") ? path : `/${path}`, `${BASE_URL}/`);
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  return url.toString();
}

/** Used only when the server sent no message. Wording follows the API doc's error-handling checklist. */
function fallbackMessage(status: number, statusText: string): string {
  if (status === 403) return "You do not have permission to do that.";
  if (status === 404) return "We could not find what you asked for.";
  if (status === 409) return "This changed in the meantime. Refresh and try again.";
  if (status === 429) return "Too many attempts. Please wait a moment and try again.";
  if (status >= 500) return "Something went wrong on our side. Please try again.";
  return statusText || "Request failed.";
}

async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
  const isForm = typeof FormData !== "undefined" && opts.body instanceof FormData;
  const headers: Record<string, string> = { Accept: "application/json", ...opts.headers };
  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    if (isForm) body = opts.body as FormData;
    else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(opts.body);
    }
  }
  const timeout = AbortSignal.timeout(TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method,
      headers,
      body,
      credentials: "include", // the API uses a session cookie
      signal: opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout,
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (opts.signal?.aborted) throw err; // the caller cancelled on purpose
    throw new ApiError(0, "network_error", "Could not reach the server. Check your connection and try again.");
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload: unknown = res.status === 204 ? undefined : isJson ? await res.json().catch(() => undefined) : await res.text().catch(() => undefined);

  if (!res.ok) {
    const b = (typeof payload === "object" && payload !== null ? payload : {}) as ApiErrorBody;
    if (res.status === 401 && !opts.skipUnauthorizedHandler) unauthorizedHandler?.();
    throw new ApiError(
      res.status,
      b.error?.code ?? b.code ?? `http_${res.status}`, // Better Auth puts code/message at the top level
      b.error?.message ?? b.message ?? fallbackMessage(res.status, res.statusText),
      b.error?.details,
    );
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>("GET", path, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) => request<T>("POST", path, { ...opts, body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) => request<T>("PUT", path, { ...opts, body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) => request<T>("PATCH", path, { ...opts, body }),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>("DELETE", path, opts),
};

/** Plain-object error, safe to keep in Redux state (Redux must not hold Error instances). */
export interface SerializedApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}
export function serializeError(err: unknown): SerializedApiError {
  if (err instanceof ApiError) return { status: err.status, code: err.code, message: err.message, details: err.details };
  return { status: 0, code: "unknown", message: getErrorMessage(err) };
}

/** A message that is safe to show, whatever was thrown. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && process.env.NODE_ENV !== "production") return err.message;
  return "Something went wrong. Please try again.";
}
