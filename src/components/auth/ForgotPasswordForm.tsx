"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthHeading } from "./AuthShell";
import { Notice, SubmitButton, TextField } from "./fields";
import { useCooldown } from "./useCooldown";
import { MailIcon } from "@/components/ui/icons";
import { validateEmail } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthError, describeAuthError, forgetPassword, selectAuth } from "@/store/slices/authSlice";

export default function ForgotPasswordForm() {
  const dispatch = useAppDispatch();
  const { email: state, error } = useAppSelector(selectAuth);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const cooldown = useCooldown(30);

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateEmail(email);
    setErr(v);
    if (v || cooldown.active) return;
    const res = await dispatch(forgetPassword({ email, redirectTo: `${window.location.origin}/reset-password` }));
    if (forgetPassword.fulfilled.match(res)) {
      setSent(true); // always the same message: the API never reveals whether the email exists
      cooldown.start();
    } else setSent(false);
  }

  const busy = state === "pending";
  return (
    <>
      <AuthHeading title="Reset your password" subtitle="Enter your email and we will send you a link to choose a new password." />
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {sent && <Notice tone="success">If an account exists, check your email for a reset link.</Notice>}
        {error && !sent && !busy && <Notice tone="error">{describeAuthError(error)}</Notice>}
        <TextField label="Email" type="email" name="email" autoComplete="email" inputMode="email" placeholder="you@company.com" icon={<MailIcon className="h-5 w-5" />}
          value={email} onChange={(e) => setEmail(e.target.value)} error={err} disabled={busy} />
        <SubmitButton loading={busy} loadingText="Sending">
          {cooldown.active ? `Send again in ${cooldown.left}s` : sent ? "Send again" : "Send reset link"}
        </SubmitButton>
      </form>
      <p className="mt-8 text-center text-sm text-ink-soft">
        Remembered it? <Link href="/login" className="font-semibold text-ink hover:underline">Back to sign in</Link>
      </p>
    </>
  );
}
