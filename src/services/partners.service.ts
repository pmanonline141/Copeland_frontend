import type { Partner, PartnerApplyInput } from "@/types/partner";
import { api } from "./apiClient"; // match the import line at the top of admin.service.ts
import { cn } from "@/utils/cn";

/**
 * Guest partner application client.
 * Flow: apply (public) -> { id, applicationToken } -> for each document: sign -> upload to Cloudinary -> attach.
 * The token lives only in this module's memory for the current page visit, so it is never persisted.
 */
const API = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

type Ctx = { id: string; token: string };
let ctx: Ctx | null = null;

async function call<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, headers, ...rest } = init;
  const res = await fetch(`${API}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-application-token": token } : {}),
      ...(headers ?? {}),
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = body?.error?.message ?? body?.message ?? body?.error;
    throw new Error(typeof msg === "string" ? msg : `Request failed (${res.status})`);
  }
  return body as T;
}

type Signature = Record<string, string | number | undefined>;

export const partnersService = {
  /** Admin / staff: every partner. Goes through the authenticated client so the session cookie is sent. */
  list: () => api.get<Partner[]>("/api/partners"),
    /** Admin / staff: one partner with its details. */
  getById: (id: string) => api.get<Partner>(`/api/partners/${id}`),
    /** Admin only: short-lived signed link for one uploaded verification document. */

      /** Admin only: approve, reject or suspend a partner. */
  review: (id: string, body: { status: "approved" | "rejected" | "suspended"; reviewNote?: string }) =>
    api.post<Partner>(`/api/partners/${id}/review`, body),

  documentDownloadUrl: (partnerId: string, documentId: string) =>
    api.get<{ url: string }>(`/api/partners/${partnerId}/documents/${documentId}/download-url`),

  async apply(input: PartnerApplyInput) {
    const r = await call<{ id: string; status: string; applicationToken: string }>("/api/partners/apply", {
      method: "POST",
      body: JSON.stringify(input),
    });
    ctx = { id: r.id, token: r.applicationToken };
    return r;
  },

  async uploadDocument(documentType: "cac" | "tin" | "id", file: File) {
    if (!ctx) throw new Error("Submit the application first.");
    const base = `/api/partners/applications/${ctx.id}/documents`;

    const sig = await call<Signature>(`${base}/sign-upload`, {
      method: "POST",
      token: ctx.token,
      body: JSON.stringify({ documentType, fileName: file.name.slice(0, 120) }),
    });

    // Build the Cloudinary form from the signature the backend returned.
    const cloud = String(sig.cloudName ?? sig.cloud_name ?? "");
    const uploadUrl = String(sig.uploadUrl ?? sig.url ?? `https://api.cloudinary.com/v1_1/${cloud}/auto/upload`);
    const form = new FormData();
    for (const [k, v] of Object.entries(sig)) {
      if (v === undefined || ["cloudName", "cloud_name", "uploadUrl", "url"].includes(k)) continue;
      form.append(k === "apiKey" ? "api_key" : k, String(v));
    }
    form.append("file", file);

    const up = await fetch(uploadUrl, { method: "POST", body: form });
    const uploaded = await up.json().catch(() => null);
    if (!up.ok || !uploaded?.secure_url) {
      throw new Error(uploaded?.error?.message ?? "The file could not be uploaded.");
    }

    return call(`${base}/attach`, {
      method: "POST",
      token: ctx.token,
      body: JSON.stringify({ documentType, url: uploaded.secure_url }),
    });
  },
};