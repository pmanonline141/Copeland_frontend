import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, AlertIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Email verification" };

/** The API sends people here after they click the link in the verification email (callbackURL). */
export default async function EmailVerified({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const failed = !!(await searchParams).error;
  return (
    <div className="text-center">
      <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${failed ? "border-danger/40 bg-danger-soft text-danger" : "border-success/40 bg-success-soft text-success"}`}>
        {failed ? <AlertIcon className="h-7 w-7" /> : <CheckIcon className="h-7 w-7" strokeWidth={2.2} />}
      </span>
      <h1 className="mt-6 text-3xl font-semibold text-ink sm:text-4xl">{failed ? "We could not verify your email" : "Email verified"}</h1>
      <p className="mt-3 text-base text-ink-soft">
        {failed ? "The link may have expired or already been used. Sign in and we will help you send a new one." : "Your account is active. Sign in to continue."}
      </p>
      <Link href="/login" className="mt-8 inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-md bg-ink px-7 text-base font-semibold text-white hover:bg-ink-soft">Go to sign in</Link>
    </div>
  );
}
