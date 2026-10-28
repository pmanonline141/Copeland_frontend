 "use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthHeading } from "./AuthShell";
import { Notice, PasswordField, SubmitButton, TextField } from "./fields";
import { useCooldown } from "./useCooldown";
import { MailIcon } from "@/components/ui/icons";
import { useAlert } from "@/hooks/useAlert";
import { safeNext, validateEmail } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthError, describeAuthError, resendVerification, selectAuth, signIn } from "@/store/slices/authSlice";
import { ROLE_HOME } from "@/types/auth";

/** How long the success alert shows before redirecting. */
const SUCCESS_DELAY_MS = 1600;

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const alert = useAlert();
  const next = safeNext(params.get("next"));
  const { status, user, signIn: signInState, email: emailState, error, needsVerification } = useAppSelector(selectAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const justSignedIn = useRef(false);
  const cooldown = useCooldown(30);

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);

  // Already signed in when the page opened: go straight to ?next or the user's own area.
  // Just signed in via this form: wait a moment so the success alert can be seen.
  useEffect(() => {
    if (status !== "authenticated" || !user) return;
    const go = () => router.replace(next ?? ROLE_HOME[user.role]);

    if (!justSignedIn.current) {
      go();
      return;
    }
    const t = window.setTimeout(go, SUCCESS_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [status, user, next, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = { email: validateEmail(email), password: password ? null : "Enter your password." };
    setErrors(v);
    setNotice(null);
    setResent(false);
    if (v.email || v.password) return;

    // Set before dispatching so the redirect effect above knows this was a fresh sign-in.
    justSignedIn.current = true;
    const res = await dispatch(signIn({ email, password }));

    if (signIn.fulfilled.match(res) && res.payload) {
      setRedirecting(true);
      alert.success("Redirecting you now...", { title: "Welcome back", duration: 3000 });
      return;
    }

    justSignedIn.current = false;
    if (signIn.fulfilled.match(res)) {
      // Signed in, but the session cookie did not come back: almost always a cross-site cookie / CORS setup issue.
      setNotice("You were signed in, but your browser did not keep the session. Please allow cookies for this site and try again.");
    }
  }

  async function onResend() {
    const res = await dispatch(resendVerification({ email, callbackURL: `${window.location.origin}/email-verified` }));
    if (resendVerification.fulfilled.match(res)) {
      setResent(true);
      cooldown.start();
    }
  }

  const busy = signInState === "pending" || redirecting;
  const justReset = params.get("reset") === "1";

  return (
    <>
      <AuthHeading title="Welcome back" subtitle="Sign in to track orders, manage your catalogue or run the Copeland dashboard." />

      <form id="login-form" onSubmit={onSubmit} noValidate className="space-y-5">
        {justReset && <Notice tone="success">Password updated. Sign in with your new password.</Notice>}
        {notice && <Notice tone="warning">{notice}</Notice>}

        {needsVerification ? (
          <Notice tone="warning">
            <p className="font-medium">Verify your email to continue.</p>
            <p className="mt-1">We sent a link when you signed up. Can&apos;t find it?</p>
            <button type="button" onClick={onResend} disabled={cooldown.active || emailState === "pending" || validateEmail(email) !== null}
              className="mt-2 font-semibold underline underline-offset-2 disabled:no-underline disabled:opacity-60">
              {emailState === "pending" ? "Sending..." : cooldown.active ? `Send again in ${cooldown.left}s` : "Resend verification email"}
            </button>
            {resent && <p className="mt-2 text-ink-soft">If an account exists, a verification email has been sent.</p>}
          </Notice>
        ) : (
          error && !busy && <Notice tone="error">{describeAuthError(error, "signIn")}</Notice>
        )}

        <TextField 
          label="Email" 
          type="email" 
          name="email" 
          autoComplete="username email" // UPDATED: Better password manager recognition
          inputMode="email" 
          placeholder="you@company.com" 
          icon={<MailIcon className="h-5 w-5" />}
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          onBlur={() => setErrors((p) => ({ ...p, email: email ? validateEmail(email) : null }))} 
          error={errors.email} 
          disabled={busy} 
        />

        <div>
          <PasswordField 
            label="Password" 
            name="password" 
            autoComplete="current-password" 
            placeholder="Your password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            error={errors.password} 
            disabled={busy} 
          />
          <div className="mt-2 text-right">
            <Link href="/forgot-password" className="text-sm font-medium text-gold-700 hover:text-gold-800 hover:underline">Forgot password?</Link>
          </div>
        </div>

        <SubmitButton 
          type="submit" // UPDATED: Forces the browser to recognize this as the form submission
          form="login-form" // UPDATED: Links to the form ID
          loading={busy} 
          loadingText={redirecting ? "Redirecting" : "Signing in"}
        >
          Sign in
        </SubmitButton>
      </form>

      <p className="mt-8 text-center text-sm text-ink-soft">
        New to Copeland? <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-ink hover:underline">Create an account</Link>
      </p>
    </>
  );
}