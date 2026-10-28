import type { ISODate } from "./api";

export type Role = "buyer" | "supplier" | "shipping" | "staff" | "admin";
export const STAFF_ROLES: Role[] = ["staff", "admin"];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  image?: string | null;
}
export interface AuthSessionInfo {
  id: string;
  expiresAt: ISODate;
}
/** GET /api/auth/get-session: `null` (or 401) when signed out. */
export interface Session {
  user: AuthUser;
  session: AuthSessionInfo;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}
export interface SignInInput {
  email: string;
  password: string;
  callbackURL?: string;
}
export interface ResetPasswordInput {
  newPassword: string;
  token: string;
}

/** Where each role lands after sign-in. */
export const ROLE_HOME: Record<Role, string> = {
  buyer: "/buyer",
  supplier: "/supplier",
  shipping: "/shipping",
  staff: "/admin",
  admin: "/admin",
};

/** Human-readable role names for dashboard chrome. */
export const ROLE_LABEL: Record<Role, string> = {
  buyer: "Buyer",
  supplier: "Supplier",
  shipping: "Shipping partner",
  staff: "Copeland staff",
  admin: "Administrator",
};
