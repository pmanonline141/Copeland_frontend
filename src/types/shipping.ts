import type { UUID } from "./api";

export type ShipmentStatus = "picked_up" | "in_transit" | "delivered";
export interface ShipmentInput {
  orderId: UUID;
  trackingNumber: string;
}
export interface ShipmentUpdate {
  status: ShipmentStatus;
  note?: string;
}
export interface Shipment {
  id: UUID;
  orderId?: UUID;
  trackingNumber?: string;
  status?: ShipmentStatus | string;
  [extra: string]: unknown;
}
