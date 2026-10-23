/**
 * Better Auth endpoints, called per the documented contract (no extra SDK).
 * The session lives in an httpOnly cookie: never put it in localStorage.
 */
import type { ResetPasswordInput, Session, SignInInput, SignUpInput } from "@/types/auth";
import { ApiError, api } from "./apiClient";

const A = "/api/auth";
const norm = (email: string) => email.trim().toLowerCase();

export const authService = {
  /** Resolves to null when signed out (the API answers 200 null or 401; both mean "signed out"). */
  async getSession(): Promise<Session | null> {
    try {
      const res = await api.get<Session | null | undefined | string>(`${A}/get-session`, { skipUnauthorizedHandler: true });
      return res && typeof res === "object" && "user" in res ? res : null;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return null;
      throw e;
    }
  },

  signUp: (b: SignUpInput) =>
    api.post<unknown>(`${A}/sign-up/email`, { name: b.name.trim(), email: norm(b.email), password: b.password }, { skipUnauthorizedHandler: true }),

  /** 401 here means wrong email/password, not an expired session, so the global 401 handler is skipped. */
  signIn: (b: SignInInput) => api.post<unknown>(`${A}/sign-in/email`, { ...b, email: norm(b.email) }, { skipUnauthorizedHandler: true }),

  /** An expired session is already signed out, so 401 is swallowed. */
  async signOut(): Promise<void> {
    try {
      await api.post<unknown>(`${A}/sign-out`, {}, { skipUnauthorizedHandler: true });
    } catch (e) {
      if (!(e instanceof ApiError && e.status === 401)) throw e;
    }
  },

  /** callbackURL must be an allowed frontend origin, e.g. `${window.location.origin}/email-verified`. */
  sendVerificationEmail: (email: string, callbackURL: string) => api.post<unknown>(`${A}/send-verification-email`, { email: norm(email), callbackURL }),

  /** Normally the email link opens the API directly; use only if the token lands on a frontend page. */
  verifyEmail: (token: string) => api.get<unknown>(`${A}/verify-email`, { query: { token } }),

  /** redirectTo must be an allowed frontend origin, e.g. `${window.location.origin}/reset-password`. */
  forgetPassword: (email: string, redirectTo: string) => api.post<unknown>(`${A}/forget-password`, { email: norm(email), redirectTo }),

  resetPassword: (b: ResetPasswordInput) => api.post<unknown>(`${A}/reset-password`, b, { skipUnauthorizedHandler: true }),
};
