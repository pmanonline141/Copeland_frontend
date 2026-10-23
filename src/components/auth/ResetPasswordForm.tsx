"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthHeading } from "./AuthShell";
import { Notice, PasswordField, SubmitButton } from "./fields";
import { validatePassword } from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthError, describeAuthError, resetPassword, selectAuth } from "@/store/slices/authSlice";

export default function ResetPasswordForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const linkError = params.get("error"); // the API redirects here with ?error=... for bad or expired links
  const { email: state, error } = useAppSelector(selectAuth);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);

  if (!token || linkError) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">This link has expired</h1>
        <p className="mt-3 text-base text-ink-soft">Reset links work once and expire after a short time. Request a new one to continue.</p>
        <Link href="/forgot-password" className="mt-8 inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-md bg-ink px-7 text-base font-semibold text-white hover:bg-ink-soft">Request a new link</Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = { password: validatePassword(password), confirm: confirm === password ? null : "Passwords do not match." };
    setErrors(v);
    if (v.password || v.confirm || !token) return;
    const res = await dispatch(resetPassword({ newPassword: password, token }));
    // Not signed in automatically: send the user to sign in.
    if (resetPassword.fulfilled.match(res)) router.replace("/login?reset=1");
  }

  const busy = state === "pending";
  return (
    <>
      <AuthHeading title="Choose a new password" subtitle="Use something you do not use anywhere else." />
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && !busy && <Notice tone="error">{error.status === 401 || error.status === 410 ? <>This link is no longer valid. <Link href="/forgot-password" className="font-semibold underline">Request a new one</Link>.</> : describeAuthError(error)}</Notice>}
        <PasswordField label="New password" name="newPassword" autoComplete="new-password" placeholder="Create a password" showStrength
          value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} disabled={busy} />
        <PasswordField label="Confirm new password" name="confirm" autoComplete="new-password" placeholder="Repeat your password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} disabled={busy} />
        <SubmitButton loading={busy} loadingText="Saving">Update password</SubmitButton>
      </form>
    </>
  );
}
