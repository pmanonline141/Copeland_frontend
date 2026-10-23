import type { CheckoutInput, CheckoutResponse, FulfillmentStatus, LookupInput, Order, OrderItem, PayResponse } from "@/types/order";
import { api } from "./apiClient";

export const ordersService = {
  // public (guest) flow
  checkout: (b: CheckoutInput) => api.post<CheckoutResponse>("/api/orders/checkout", { ...b, email: b.email.trim().toLowerCase() }),
  pay: (orderId: string) => api.post<PayResponse>(`/api/orders/${orderId}/pay`, {}),
  cancel: (orderId: string, email: string) => api.post<{ message: string }>(`/api/orders/${orderId}/cancel`, { email: email.trim().toLowerCase() }),
  lookup: (b: LookupInput) => api.post<Order>("/api/orders/lookup", { orderNumber: b.orderNumber.trim(), email: b.email.trim().toLowerCase() }),

  // supplier (approved)
  supplierOrders: () => api.get<Order[]>("/api/orders/supplier"),
  updateFulfillment: (orderId: string, orderItemId: string, status: FulfillmentStatus) =>
    api.patch<OrderItem>(`/api/orders/${orderId}/items/${orderItemId}/fulfillment`, { status }),

  // admin / staff
  assignShippingPartner: (orderId: string, shippingPartnerId: string) => api.put<Order>(`/api/orders/${orderId}/shipping-partner`, { shippingPartnerId }),
};
