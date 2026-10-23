import type { ISODate, UUID } from "./api";

export type ProductStatus = "draft" | "submitted" | "live" | "rejected" | "changes_requested" | "paused" | string;

export interface InventoryVariant {
  size?: string;
  colour?: string;
  quantityAvailable: number;
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
  /** "Copeland label" badge, set by admin moderation. */
  label?: boolean;
  supplierId?: string;
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
