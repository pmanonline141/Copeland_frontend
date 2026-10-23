import type { Shipment, ShipmentInput, ShipmentUpdate } from "@/types/shipping";
import { api } from "./apiClient";

export const shippingService = {
  create: (b: ShipmentInput) => api.post<Shipment>("/api/orders/shipping/shipments", b),
  update: (id: string, b: ShipmentUpdate) => api.patch<Shipment>(`/api/orders/shipping/shipments/${id}`, b),
};
