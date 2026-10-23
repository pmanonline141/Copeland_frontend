import type {
  BankVerifyInput, BankVerifyResponse, CommissionResponse, Partner, PartnerApplyInput, PartnerQuery, PartnerReviewInput, UploadUrlInput, UploadUrlResponse,
} from "@/types/partner";
import { ApiError, api } from "./apiClient";

export const partnersService = {
  apply: (b: PartnerApplyInput) => api.post<Partner>("/api/partners/apply", { partnerType: "supplier", ...b }),

  /** Step 1 of a document upload. See uploadDocument() for the full flow. */
  createUploadUrl: (b: UploadUrlInput) => api.post<UploadUrlResponse>("/api/partners/documents/upload-url", b),

  /**
   * Full upload: ask the API for a signed URL, then PUT the file straight to storage.
   * The docs say "the storage provider's signed-upload mechanism" (Supabase): a PUT to signedUrl
   * with the file as the body. The browser must NOT send our cookie there, so this uses plain fetch.
   * Returns the documentId to keep with the application.
   */
  async uploadDocument(documentType: UploadUrlInput["documentType"], file: File): Promise<UploadUrlResponse> {
    const target = await partnersService.createUploadUrl({ documentType, fileName: file.name.slice(0, 120) });
    let res: Response;
    try {
      res = await fetch(target.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
        body: file,
      });
    } catch {
      throw new ApiError(0, "upload_network_error", "Could not upload the file. Check your connection and try again.");
    }
    if (!res.ok) throw new ApiError(res.status, "upload_failed", "The file could not be uploaded. Please try again.");
    return target;
  },

  verifyBankDetails: (b: BankVerifyInput) => api.post<BankVerifyResponse>("/api/partners/bank-details/verify", b),

  // admin / staff
  list: (query: PartnerQuery = {}) => api.get<Partner[]>("/api/partners", { query: { ...query } }),
  // admin
  review: (id: string, b: PartnerReviewInput) => api.post<Partner>(`/api/partners/${id}/review`, b),
  /** Pass null to fall back to the default commission. Rate is basis points, 0-10000. */
  setCommission: (id: string, commissionRateBps: number | null) => api.put<CommissionResponse>(`/api/partners/${id}/commission`, { commissionRateBps }),
  documentDownloadUrl: (partnerId: string, documentId: string) => api.get<{ signedUrl: string }>(`/api/partners/${partnerId}/documents/${documentId}/download-url`),
};
