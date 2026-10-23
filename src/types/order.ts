import type { ISODate, UUID } from "./api";

export interface CartItem {
  productId: UUID;
  quantity: number;
  size?: string;
  colour?: string;
  /** Display-only snapshot; the server recalculates every price and total. */
  name?: string;
  priceKobo?: number;
  image?: string;
}

export interface CheckoutInput {
  email: string;
  name?: string;
  phone?: string;
  items: Pick<CartItem, "productId" | "quantity" | "size" | "colour">[];
}

export type OrderStatus = string;
export type FulfillmentStatus = "packed" | "shipped" | "delivered";

export interface OrderItem {
  id: UUID;
  productId: UUID;
  quantity: number;
  size?: string | null;
  colour?: string | null;
  unitPriceKobo?: number;
  fulfillmentStatus?: string;
  [extra: string]: unknown;
}

export interface Order {
  id: UUID;
  orderNumber?: string;
  email?: string;
  status?: OrderStatus;
  totalKobo?: number;
  requiresAdminReview?: boolean;
  shippingPartnerId?: string | null;
  items?: OrderItem[];
  createdAt?: ISODate;
  [extra: string]: unknown;
}

export interface CheckoutResponse {
  message: string;
  order: Order;
}

/** Shape of `paymentData` is not documented: read the URL/reference defensively. */
export interface PaymentData {
  authorization_url?: string;
  authorizationUrl?: string;
  access_code?: string;
  reference?: string;
  [extra: string]: unknown;
}
export interface PayResponse {
  message: string;
  paymentData: PaymentData;
}

export interface LookupInput {
  orderNumber: string;
  email: string;
}

/** Returns the URL to redirect the buyer to, if present. */
export function getPaymentUrl(d: PaymentData | undefined): string | null {
  return d?.authorization_url ?? d?.authorizationUrl ?? (typeof d?.url === "string" ? d.url : null) ?? null;
}
