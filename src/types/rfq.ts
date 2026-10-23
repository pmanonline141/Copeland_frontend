import type { ISODate, UUID } from "./api";
import type { CartItem } from "./order";

export type RfqStatus = "in_review" | "quoted" | "declined" | "closed";

export interface RfqInput {
  name: string;
  email: string;
  phone?: string;
  details?: string; // max 5000
  items: Pick<CartItem, "productId" | "quantity" | "size" | "colour">[];
}
export interface Rfq {
  id: UUID;
  name?: string;
  email?: string;
  status?: RfqStatus | string;
  quoteAmountKobo?: number | null;
  quoteMessage?: string | null;
  createdAt?: ISODate;
  [extra: string]: unknown;
}
export interface RfqUpdate {
  status: RfqStatus;
  quoteAmountKobo?: number;
  quoteMessage?: string;
}
export interface RfqResponseInput {
  email: string;
  accepted: boolean;
}
export interface RfqCount {
  status: string;
  count: number;
}
