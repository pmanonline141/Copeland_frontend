import type { Rfq, RfqCount, RfqInput, RfqResponseInput, RfqUpdate } from "@/types/rfq";
import { api } from "./apiClient";

export const rfqsService = {
  // public
  create: (b: RfqInput) => api.post<Rfq>("/api/orders/rfqs", { ...b, email: b.email.trim().toLowerCase() }),
  respond: (id: string, b: RfqResponseInput) => api.post<Rfq>(`/api/orders/rfqs/${id}/respond`, { ...b, email: b.email.trim().toLowerCase() }),

  // admin / staff
  list: (status?: string) => api.get<Rfq[]>("/api/orders/rfqs", { query: { status } }),
  update: (id: string, b: RfqUpdate) => api.patch<Rfq>(`/api/orders/rfqs/${id}`, b),
  counts: () => api.get<RfqCount[]>("/api/admin/rfq-counts"),
};
