import type { ISODate, UUID } from "./api";

/** The live API uses "approved" for products that are visible in the catalogue. */
export type ProductStatus = "draft" | "submitted" | "approved" | "live" | "rejected" | "changes_requested" | "paused" | string;

export interface InventoryVariant {
  size?: string;
  colour?: string;
  quantityAvailable: number;
}

export interface ProductSupplier {
  id: UUID;
  name: string;
}

/** The docs do not list every product field; unknown extras are tolerated. */
export interface Product {
  id: UUID;
  name: string;
  description: string;
  category: string;
  priceKobo: number;
  moq?: number | null;
  quantityAvailable?: number | null;
  colours?: string[];
  sizes?: string[];
  images?: string[];
  tier?: string | null;
  inventory?: InventoryVariant[];
  status?: ProductStatus;
  /** The Copeland badge / label, set by admin moderation (the live API field). */
  isCopelandLabel?: boolean;
  /** Legacy/showcase alias for isCopelandLabel; the card accepts either. */
  label?: boolean;
  /** Present on every product from the API. The UI must NOT show it on badged items (PRD 7.5). */
  supplier?: ProductSupplier;
  supplierId?: string;
  rejectionReason?: string | null;
  createdAt?: ISODate;
  updatedAt?: ISODate;
}

/** GET /api/products query. Prices in kobo. */
export interface ProductQuery {
  q?: string;
  category?: string;
  size?: string;
  label?: boolean;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductList {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductInput {
  name: string;
  description: string;
  category: string;
  priceKobo: number;
  moq?: number;
  quantityAvailable?: number;
  colours?: string[];
  sizes?: string[];
  images?: string[];
  tier?: string;
  inventory?: InventoryVariant[];
}
export type ProductUpdate = Partial<Omit<ProductInput, "inventory">>;

export type ModerationAction = "approve" | "reject" | "changes_requested" | "pause" | "badge";
export interface ModerateInput {
  action: ModerationAction;
  reason?: string;
}