import type { Metadata } from "next";
import PartnerApplicationForm from "@/components/partners/PartnerApplicationForm";
import PageHeader from "@/components/dashboard/PageHeader";

export const metadata: Metadata = {
  title: "Partner Application | Copeland",
  description: "Apply to become a supplier or shipping partner on Copeland Africa.",
};

export default function PartnerApplyPage() {
  return (
    <main className="container max-w-3xl py-12 sm:py-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Partner with Copeland
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Join Nigeria's leading clothing infrastructure platform. Reach more customers and grow your business with our professional network.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-6 shadow-card sm:p-10">
        <PartnerApplicationForm />
      </div>
    </main>
  );
}
