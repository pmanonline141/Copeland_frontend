import type { ModerateInput, Product, ProductInput, ProductList, ProductQuery, ProductUpdate } from "@/types/product";
import { ApiError, api } from "./apiClient";

type ProductImageSignature = {
  allowed_formats: string;
  folder: string;
  tags: string;
  timestamp: number;
  signature: string;
  apiKey: string;
  uploadUrl: string;
};

async function uploadProductImage(file: File): Promise<string> {
  const signature = await api.post<ProductImageSignature>("/api/products/images/sign", {});
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("allowed_formats", signature.allowed_formats);
  form.append("folder", signature.folder);
  form.append("tags", signature.tags);
  form.append("timestamp", String(signature.timestamp));
  form.append("signature", signature.signature);

  let response: Response;
  try {
    response = await fetch(signature.uploadUrl, { method: "POST", body: form });
  } catch {
    throw new ApiError(0, "image_upload_failed", "Could not reach image storage. Check your connection and try again.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok || typeof body?.secure_url !== "string") {
    throw new ApiError(
      response.status,
      "image_upload_failed",
      body?.error?.message ?? "An image could not be uploaded. Please try again.",
    );
  }
  return body.secure_url;
}

/** The docs don't fix the list shape, so accept an array or a paginated object. */
export function normalizeProductList(raw: unknown, query: ProductQuery = {}): ProductList {
  const r = (raw ?? {}) as Record<string, unknown>;
  const items = (Array.isArray(raw) ? raw : (r.items ?? r.products ?? r.data ?? [])) as Product[];
  const pagination = ((r.pagination ?? r.meta ?? r) as Record<string, unknown>) ?? {};
  const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
  const limit = num(pagination.limit ?? pagination.pageSize, query.limit ?? (items.length || 20));
  const total = num(pagination.total ?? pagination.totalCount, items.length);
  return {
    items,
    page: num(pagination.page, query.page ?? 1),
    limit,
    total,
    totalPages: num(pagination.totalPages ?? pagination.pages, Math.max(1, Math.ceil(total / Math.max(1, limit)))),
  };
}

export const productsService = {
  async list(query: ProductQuery = {}, signal?: AbortSignal): Promise<ProductList> {
    const raw = await api.get<unknown>("/api/products", { query: { ...query }, signal });
    return normalizeProductList(raw, query);
  },
  get: (id: string, signal?: AbortSignal) => api.get<Product>(`/api/products/${id}`, { signal }),

  // supplier (approved)
  mine: () => api.get<Product[]>("/api/products/mine"),
  uploadImage: uploadProductImage,
  create: (b: ProductInput) => api.post<Product>("/api/products", b),
  update: (id: string, b: ProductUpdate) => api.patch<Product>(`/api/products/${id}`, b),
  submit: (id: string) => api.post<Product>(`/api/products/${id}/submit`, {}),

  // admin / staff (badge: admin only)
  moderate: (id: string, b: ModerateInput) => api.post<Product>(`/api/products/${id}/moderate`, b),
};
