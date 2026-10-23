import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/auth.service";
import { serializeError, type SerializedApiError } from "@/services/apiClient";
import type { AuthUser, ResetPasswordInput, Role, Session, SignInInput, SignUpInput } from "@/types/auth";
import { createAppThunk, errorFrom } from "../thunk";

type Busy = "idle" | "pending";
export interface AuthState {
  user: AuthUser | null;
  session: Session["session"] | null;
  /** idle = not checked yet, loading = first check running. Route guards should wait for both to end. */
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  signIn: Busy;
  signUp: Busy;
  signOut: Busy;
  email: Busy; // verification / forgot / reset requests
  error: SerializedApiError | null;
  /** Sign-in was refused because the email is not verified yet: show a "resend" action. */
  needsVerification: boolean;
  /** Email to show on the verification-pending screen after sign-up. */
  pendingVerificationEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  status: "idle",
  signIn: "idle",
  signUp: "idle",
  signOut: "idle",
  email: "idle",
  error: null,
  needsVerification: false,
  pendingVerificationEmail: null,
};

const wrap = <A, R>(fn: (a: A) => Promise<R>) => async (arg: A, { rejectWithValue }: { rejectWithValue: (e: SerializedApiError) => unknown }) => {
  try {
    return await fn(arg);
  } catch (e) {
    return rejectWithValue(serializeError(e)) as never;
  }
};

/** Restores the session on page load, and after any 401. Resolves to null when signed out. */
export const fetchSession = createAppThunk("auth/fetchSession", wrap((_: void) => authService.getSession()), {
  condition: (_, { getState }) => (getState() as { auth: AuthState }).auth.status !== "loading",
});

/** Signs in, then loads the session so the caller can route by role. */
export const signIn = createAppThunk("auth/signIn", async (input: SignInInput, { rejectWithValue }) => {
  try {
    await authService.signIn(input);
    return await authService.getSession();
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
}, { condition: (_, { getState }) => (getState() as { auth: AuthState }).auth.signIn !== "pending" });

/** Does NOT sign the user in: email must be verified first. */
export const signUp = createAppThunk("auth/signUp", async (input: SignUpInput, { rejectWithValue }) => {
  try {
    await authService.signUp(input);
    return { email: input.email.trim().toLowerCase() };
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
}, { condition: (_, { getState }) => (getState() as { auth: AuthState }).auth.signUp !== "pending" });

export const signOut = createAppThunk("auth/signOut", wrap((_: void) => authService.signOut()), {
  condition: (_, { getState }) => (getState() as { auth: AuthState }).auth.signOut !== "pending",
});

export const resendVerification = createAppThunk("auth/resendVerification", wrap((a: { email: string; callbackURL: string }) => authService.sendVerificationEmail(a.email, a.callbackURL)));
export const verifyEmail = createAppThunk("auth/verifyEmail", wrap((token: string) => authService.verifyEmail(token)));
export const forgetPassword = createAppThunk("auth/forgetPassword", wrap((a: { email: string; redirectTo: string }) => authService.forgetPassword(a.email, a.redirectTo)));
export const resetPassword = createAppThunk("auth/resetPassword", wrap((b: ResetPasswordInput) => authService.resetPassword(b)));

/** User-facing text for auth failures, per the API doc (401 wrong credentials, 403 unverified, 429 rate limit). */
export function describeAuthError(e: SerializedApiError, flow: "signIn" | "signUp" | "other" = "other"): string {
  if (flow === "signIn") {
    if (e.status === 401) return "Email or password is incorrect.";
    if (e.status === 403) return "Please verify your email before signing in.";
  }
  if (flow === "signUp" && e.status === 422) return e.message || "That email is already registered, or the password was rejected.";
  if (e.status === 429) return "Too many attempts. Please try again later.";
  return e.message || "Something went wrong. Please try again.";
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
      state.needsVerification = false;
    },
    /** Dispatched when something outside this slice learns the session is gone. */
    sessionCleared(state) {
      state.user = null;
      state.session = null;
      state.status = "unauthenticated";
    },
    setPendingVerificationEmail(state, a: PayloadAction<string | null>) {
      state.pendingVerificationEmail = a.payload;
    },
  },
  extraReducers: (b) => {
    const apply = (s: AuthState, session: Session | null) => {
      s.user = session?.user ?? null;
      s.session = session?.session ?? null;
      s.status = session ? "authenticated" : "unauthenticated";
    };

    b.addCase(fetchSession.pending, (s) => {
      if (s.status === "idle") s.status = "loading";
    });
    b.addCase(fetchSession.fulfilled, (s, a) => apply(s, a.payload));
    b.addCase(fetchSession.rejected, (s, a) => {
      if (a.meta.condition) return;
      // A network/server failure is not "signed out": keep what we had, but stop the loading state.
      if (s.status === "loading" || s.status === "idle") s.status = s.user ? "authenticated" : "unauthenticated";
      s.error = errorFrom(a);
    });

    b.addCase(signIn.pending, (s) => {
      s.signIn = "pending";
      s.error = null;
      s.needsVerification = false;
    });
    b.addCase(signIn.fulfilled, (s, a) => {
      s.signIn = "idle";
      apply(s, a.payload);
    });
    b.addCase(signIn.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.signIn = "idle";
      s.error = errorFrom(a);
      s.needsVerification = s.error.status === 403;
    });

    b.addCase(signUp.pending, (s) => {
      s.signUp = "pending";
      s.error = null;
    });
    b.addCase(signUp.fulfilled, (s, a) => {
      s.signUp = "idle";
      s.pendingVerificationEmail = a.payload.email;
    });
    b.addCase(signUp.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.signUp = "idle";
      s.error = errorFrom(a);
    });

    b.addCase(signOut.pending, (s) => {
      s.signOut = "pending";
    });
    for (const t of [resendVerification, verifyEmail, forgetPassword, resetPassword]) {
      b.addCase(t.pending, (s) => {
        s.email = "pending";
        s.error = null;
      });
      b.addCase(t.fulfilled, (s) => {
        s.email = "idle";
      });
      b.addCase(t.rejected, (s, a) => {
        s.email = "idle";
        s.error = errorFrom(a);
      });
    }

    // Sign out locally even if the request failed: the user asked to leave.
    b.addMatcher(
      (a) => signOut.fulfilled.match(a) || (signOut.rejected.match(a) && !a.meta.condition),
      (s) => {
        s.signOut = "idle";
        s.user = null;
        s.session = null;
        s.status = "unauthenticated";
        s.error = null;
        s.needsVerification = false;
      },
    );
  },
});

export const { clearAuthError, sessionCleared, setPendingVerificationEmail } = authSlice.actions;
export default authSlice.reducer;

type S = { auth: AuthState };
export const selectAuth = (s: S) => s.auth;
export const selectUser = (s: S) => s.auth.user;
export const selectRole = (s: S): Role | null => s.auth.user?.role ?? null;
export const selectIsAuthenticated = (s: S) => s.auth.status === "authenticated";
/** True until the first session check finishes. */
export const selectAuthResolving = (s: S) => s.auth.status === "idle" || s.auth.status === "loading";
export const selectHasRole = (roles: Role[]) => createSelector([selectRole], (r) => (r ? roles.includes(r) : false));
