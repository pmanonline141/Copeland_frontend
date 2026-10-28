"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { showAlert } from "@/store/slices/uiSlice";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import PageHeader from "@/components/dashboard/PageHeader";
import Panel from "@/components/dashboard/Panel";
import QueryState from "@/components/dashboard/QueryState";
import { Pill } from "@/components/ui/Badge";
import { AlertIcon, CheckIcon, DownloadIcon, MailIcon, PhoneIcon, UserIcon, XIcon } from "@/components/ui/icons";
import { useAsync } from "@/hooks/useAsync";
import { partnersService } from "@/services/partners.service";
import { btn } from "@/components/ui/button";
import { formatDate } from "@/utils/format";
import { humanize, statusTone } from "@/utils/status";
import { Notice } from "@/components/auth/fields";
import { cn } from "@/utils/cn";
import Modal from "@/components/ui/Modal";

export default function AdminPartnerReviewPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <DashboardGuard roles={["staff", "admin"]}>
      <PartnerReviewContent id={id} />
    </DashboardGuard>
  );
}

function PartnerReviewContent({ id }: { id: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: partner, loading, error, reload } = useAsync(() => partnersService.getById(id), [id]);
  
  const [reviewNote, setReviewNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingReview, setPendingReview] = useState<"approved" | "rejected" | null>(null);

  const handleReview = async () => {
    if (!pendingReview) return;
    const status = pendingReview;
    setActionLoading(true);
    try {
      await partnersService.review(id, { status, reviewNote });
      dispatch(showAlert({ kind: "success", title: "Review submitted", message: `The application has been ${status}.` }));
      router.push("/admin");
    } catch (err: any) {
      dispatch(showAlert({ kind: "error", title: "Review failed", message: err.message || "Failed to submit review" }));
    } finally {
      setActionLoading(false);
    }
  };

  const downloadDoc = async (docId: string) => {
    try {
      const { signedUrl } = await partnersService.documentDownloadUrl(id, docId);
      window.open(signedUrl, "_blank");
    } catch (err: any) {
      dispatch(showAlert({ kind: "error", title: "Download failed", message: "Failed to get download link: " + err.message }));
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Partner Network"
        title={partner?.businessName || "Partner Application"}
        description={`Reviewing credentials for ${partner?.partnerType || "partner"}`}
        backHref="/admin"
      />

      <QueryState loading={loading} error={error} onRetry={reload}>
        {partner && (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <Panel title="Company Information" description="Official registration and tax details.">
                <div className="grid gap-6 p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Registered Name</p>
                    <p className="mt-1 font-medium text-ink">{partner.companyName || partner.businessName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Trading Name</p>
                    <p className="mt-1 font-medium text-ink">{partner.businessName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">CAC Number</p>
                    <p className="mt-1 font-mono text-sm text-ink">{partner.cacNumber || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">TIN</p>
                    <p className="mt-1 font-mono text-sm text-ink">{partner.tin || "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Business Address</p>
                    <p className="mt-1 text-ink">{partner.address || "—"}</p>
                  </div>
                </div>
              </Panel>

              <Panel title="Contact Details" description="Primary contact for this business.">
                <div className="grid gap-6 p-5 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-ink-soft">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Contact Person</p>
                      <p className="font-medium text-ink">{partner.contactName || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-ink-soft">
                      <MailIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Email Address</p>
                      <a href={`mailto:${partner.contactEmail}`} className="font-medium text-gold hover:underline">
                        {partner.contactEmail || "—"}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-ink-soft">
                      <PhoneIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Phone Number</p>
                      <p className="font-medium text-ink">{partner.contactPhone || "—"}</p>
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel title="Capabilities" description="Categories, services or regions covered.">
                <div className="flex flex-wrap gap-2 p-5">
                  {Array.isArray(partner.capabilities) && partner.capabilities.length > 0 ? (
                    partner.capabilities.map((cap: string) => (
                      <span key={cap} className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink-soft">
                        {cap}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-ink-faint italic">No capabilities listed</p>
                  )}
                </div>
              </Panel>

              <Panel title="Verification Documents" description="Click to download and review registration files.">
                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  {partner.documents?.map((doc: any) => (
                    <button
                      key={doc.id}
                      onClick={() => downloadDoc(doc.id)}
                      className="flex items-center justify-between gap-3 rounded-lg border border-line p-4 text-left transition-colors hover:border-gold hover:bg-gold-soft/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-gold-soft text-gold-900">
                          <DownloadIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold uppercase text-ink">{doc.documentType}</p>
                          <p className="text-xs text-ink-faint">Verification Document</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  {(!partner.documents || partner.documents.length === 0) && (
                    <p className="text-sm text-ink-faint italic">No documents uploaded</p>
                  )}
                </div>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel title="Review Action" description="Current application status.">
                <div className="p-5 space-y-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Current Status</p>
                    <div className="mt-2">
                      <Pill tone={statusTone(partner.status)}>{humanize(partner.status)}</Pill>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-ink">Review Notes</label>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Enter internal notes or reasons for rejection..."
                      className="min-h-[120px] w-full rounded-md border border-line p-3 text-sm focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      disabled={actionLoading || partner.status === "approved"}
                      onClick={() => setPendingReview("approved")}
                      className={cn(btn("primary", "lg", "w-full"), "bg-success hover:bg-success-dark border-none")}
                    >
                      Approve Application
                    </button>
                    <button
                      disabled={actionLoading || partner.status === "rejected"}
                      onClick={() => setPendingReview("rejected")}
                      className={btn("subtle", "lg", "w-full text-danger hover:bg-danger-soft")}
                    >
                      Reject Application
                    </button>
                  </div>
                </div>
              </Panel>

              <Panel title="History">
                <div className="p-5 text-sm space-y-4">
                  <div className="flex justify-between">
                    <span className="text-ink-faint">Submitted</span>
                    <span className="text-ink">{formatDate(partner.createdAt)}</span>
                  </div>
                  {partner.reviewedAt && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-ink-faint">Reviewed At</span>
                        <span className="text-ink">{formatDate(partner.reviewedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-faint">Reviewed By</span>
                        <span className="text-ink">{partner.reviewedBy || "—"}</span>
                      </div>
                    </>
                  )}
                </div>
              </Panel>
            </div>
          </div>
        )}
      </QueryState>
      <Modal
        open={pendingReview !== null}
        onClose={() => {
          if (!actionLoading) setPendingReview(null);
        }}
        title={pendingReview === "approved" ? "Approve partner application?" : "Reject partner application?"}
      >
        <p className="text-sm leading-6 text-slate-600">
          {pendingReview === "approved"
            ? `Approve ${partner?.businessName ?? "this application"} as a ${partner?.partnerType ?? "partner"}? This will activate the partner account.`
            : `Reject ${partner?.businessName ?? "this application"}? The applicant will be notified of the decision.`}
        </p>
        {reviewNote.trim() && (
          <div className="mt-4 rounded-md bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Review note</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{reviewNote}</p>
          </div>
        )}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => setPendingReview(null)}
            className={btn("subtle", "md")}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => void handleReview()}
            className={cn(
              btn("primary", "md"),
              pendingReview === "rejected" && "bg-danger hover:bg-danger/90",
              pendingReview === "approved" && "bg-success hover:bg-success-dark",
            )}
          >
            {actionLoading
              ? "Processing..."
              : pendingReview === "approved"
                ? "Confirm approval"
                : "Confirm rejection"}
          </button>
        </div>
      </Modal>
    </>
  );
}
