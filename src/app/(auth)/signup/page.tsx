import type { Metadata } from "next";
import { Suspense } from "react";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = { title: "Create account" };

// useSearchParams() in the form needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}
