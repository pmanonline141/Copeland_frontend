import type { Analytics, AuditEntry, LedgerAdjustmentInput, LedgerEntry, PartnerStatement, PayoutItem } from "@/types/admin";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import { api } from "./apiClient";

export const adminService = {
  // admin / staff
  productsForReview: () => api.get<Product[]>("/api/admin/products/review"),
  flaggedOrders: () => api.get<Order[]>("/api/admin/orders/flagged"),
  payouts: (status?: string) => api.get<PayoutItem[]>("/api/admin/payouts", { query: { status } }),
  analytics: () => api.get<Analytics>("/api/admin/analytics"),

  // admin only
  /** limit is clamped by the API to 1-200 (default 50). */
  auditLog: (limit?: number) => api.get<AuditEntry[]>("/api/admin/audit-log", { query: { limit } }),
  createAdjustment: (partnerId: string, b: LedgerAdjustmentInput) => api.post<LedgerEntry>(`/api/admin/partners/${partnerId}/adjustments`, b),
  partnerStatement: (partnerId: string) => api.get<PartnerStatement>(`/api/admin/partners/${partnerId}/statement`),
};
