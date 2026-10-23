import type { ISODate, KoboString, UUID } from "./api";

export interface AuditEntry {
  id?: string;
  createdAt?: ISODate;
  [extra: string]: unknown;
}
export interface PayoutItem {
  id: UUID;
  orderItemId?: UUID;
  status?: string;
  amountKobo?: number | KoboString;
  [extra: string]: unknown;
}
export interface LedgerEntry {
  id?: UUID;
  amountKobo?: number | KoboString;
  note?: string;
  orderId?: UUID | null;
  createdAt?: ISODate;
  [extra: string]: unknown;
}
export interface LedgerAdjustmentInput {
  amountKobo: number; // non-zero safe integer
  note: string; // max 2000
  orderId?: UUID;
}
export interface PartnerStatement {
  partner?: { id: UUID; businessName: string };
  balanceKobo: KoboString;
  entries: LedgerEntry[];
}
export interface Analytics {
  salesByDay: unknown[];
  salesBySupplier: unknown[];
  commissionEarned: unknown;
  pendingPayouts: unknown;
  [extra: string]: unknown;
}
export interface ManualPayoutInput {
  reference: string;
}
