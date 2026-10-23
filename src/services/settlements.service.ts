import type { LedgerEntry, ManualPayoutInput, PartnerStatement, PayoutItem } from "@/types/admin";
import { api } from "./apiClient";

export const settlementsService = {
  // admin
  list: () => api.get<PayoutItem[]>("/api/settlements"),
  initiatePayout: (orderId: string) => api.post<{ message: string; [extra: string]: unknown }>(`/api/settlements/payout/${orderId}`, {}),
  approveItem: (orderItemId: string) => api.post<PayoutItem>(`/api/settlements/payout-items/${orderItemId}/approve`, {}),
  manualPayout: (orderItemId: string, b: ManualPayoutInput) => api.post<PayoutItem>(`/api/settlements/payout-items/${orderItemId}/manual`, b),

  // approved supplier
  myStatement: () => api.get<Pick<PartnerStatement, "balanceKobo"> & { entries: LedgerEntry[] }>("/api/settlements/statement"),
};
