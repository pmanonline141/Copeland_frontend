import type { ISODate, UUID } from "./api";

export type PartnerType = "supplier" | "shipping";
export type PartnerStatus = "pending" | "approved" | "rejected" | "suspended" | string;
export type PartnerReviewStatus = "approved" | "rejected" | "suspended";
export type PartnerDocumentType = "cac" | "tin" | "id";

export interface PartnerApplyInput {
  companyName: string;
  businessName?: string;
  cacNumber: string;
  tin: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  capabilities: string[];
  partnerType?: PartnerType;
}

export interface Partner {
  id: UUID;
  userId?: string;
  businessName?: string;
  companyName?: string;
  partnerType?: PartnerType;
  status?: PartnerStatus;
  reviewNote?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: ISODate | null;
  createdAt?: ISODate;
  commissionRateBps?: number | null;
  [extra: string]: unknown;
}

export interface PartnerQuery {
  status?: string;
  type?: PartnerType;
}

export interface UploadUrlInput {
  documentType: PartnerDocumentType;
  fileName: string; // 1-120 chars
}
export interface UploadUrlResponse {
  documentId: UUID;
  path: string;
  token: string;
  signedUrl: string;
}

export interface BankVerifyInput {
  accountNumber: string;
  bankCode: string;
}
export interface BankVerifyResponse {
  id: UUID;
  bankAccountName: string;
  bankAccountVerifiedAt: ISODate;
}

export interface PartnerReviewInput {
  status: PartnerReviewStatus;
  reviewNote?: string;
}
export interface CommissionResponse {
  id: UUID;
  commissionRateBps: number | null;
}
