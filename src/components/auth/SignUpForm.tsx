"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthHeading } from "./AuthShell";
import { Notice, PasswordField, SubmitButton, TextField } from "./fields";
import { useCooldown } from "./useCooldown";
import { MailIcon, UserIcon } from "@/components/ui/icons";
import { safeNext, validateEmail, validateName, validatePassword } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthError, describeAuthError, resendVerification, selectAuth, setPendingVerificationEmail, signUp } from "@/store/slices/authSlice";
import { ROLE_HOME } from "@/types/auth";

export default function SignUpForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { status, user, signUp: signUpState, email: emailState, error, pendingVerificationEmail } = useAppSelector(selectAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [resent, setResent] = useState(false);
  const cooldown = useCooldown(30);

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);
  useEffect(() => {
    if (status === "authenticated" && user) router.replace(next ?? ROLE_HOME[user.role]);
  }, [status, user, next, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = { name: validateName(name), email: validateEmail(email), password: validatePassword(password), confirm: confirm === password ? null : "Passwords do not match." };
    setErrors(v);
    if (Object.values(v).some(Boolean)) return;
    // No role is sent: the API sets every new account to "buyer".
    await dispatch(signUp({ name, email, password }));
  }

  async function onResend() {
    if (!pendingVerificationEmail) return;
    const res = await dispatch(resendVerification({ email: pendingVerificationEmail, callbackURL: `${window.location.origin}/email-verified` }));
    if (resendVerification.fulfilled.match(res)) {
      setResent(true);
      cooldown.start();
    }
  }

  // ---- Step 2: verification pending ----
  if (pendingVerificationEmail) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-gold-50 text-gold-700"><MailIcon className="h-7 w-7" /></span>
        <h1 className="mt-6 text-3xl font-semibold text-ink sm:text-4xl">Check your email</h1>
        <p className="mt-3 text-base text-ink-soft">
          We sent a verification link to <span className="font-semibold text-ink">{pendingVerificationEmail}</span>. Open it to activate your account, then sign in.
        </p>
        <div className="mt-8 space-y-3">
          <Link href="/login" className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-md bg-ink px-7 text-base font-semibold text-white hover:bg-ink-soft">Go to sign in</Link>
          <button type="button" onClick={onResend} disabled={cooldown.active || emailState === "pending"}
            className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-md border border-ink/25 px-7 text-base font-semibold text-ink hover:border-ink disabled:opacity-50">
            {emailState === "pending" ? "Sending..." : cooldown.active ? `Send again in ${cooldown.left}s` : "Resend email"}
          </button>
        </div>
        {resent && <div className="mt-4 text-left"><Notice tone="success">If an account exists, a verification email has been sent.</Notice></div>}
        {error && !resent && <div className="mt-4 text-left"><Notice tone="error">{describeAuthError(error)}</Notice></div>}
        <button type="button" onClick={() => dispatch(setPendingVerificationEmail(null))} className="mt-6 text-sm text-ink-soft hover:text-ink hover:underline">Used the wrong email? Start again</button>
      </div>
    );
  }

  // ---- Step 1: the form ----
  const busy = signUpState === "pending";
  return (
    <>
      <AuthHeading title="Create your account" subtitle="Buyers can order and track. Suppliers and shipping partners create an account first, then apply." />

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && !busy && (
          <Notice tone="error">
            {describeAuthError(error, "signUp")}
            {error.status === 422 && <> <Link href="/login" className="font-semibold underline">Sign in instead</Link></>}
          </Notice>
        )}

        <TextField label="Full name" name="name" autoComplete="name" placeholder="Ada Okafor" icon={<UserIcon className="h-5 w-5" />}
          value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setErrors((p) => ({ ...p, name: name ? validateName(name) : null }))} error={errors.name} disabled={busy} />
        <TextField label="Email" type="email" name="email" autoComplete="email" inputMode="email" placeholder="you@company.com" icon={<MailIcon className="h-5 w-5" />}
          value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setErrors((p) => ({ ...p, email: email ? validateEmail(email) : null }))} error={errors.email} disabled={busy} />
        <PasswordField label="Password" name="password" autoComplete="new-password" placeholder="Create a password" showStrength
          value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} disabled={busy} />
        <PasswordField label="Confirm password" name="confirm" autoComplete="new-password" placeholder="Repeat your password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} disabled={busy} />

        <SubmitButton loading={busy} loadingText="Creating account">Create account</SubmitButton>
      </form>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Already have an account? <Link href="/login" className="font-semibold text-ink hover:underline">Sign in</Link>
      </p>
    </>
  );
}
