 "use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { showAlert } from "@/store/slices/uiSlice";
import { Notice, SubmitButton } from "@/components/auth/fields";
import { btn } from "@/components/ui/button";
import { AlertIcon, CheckIcon, StoreIcon, TruckIcon, UploadIcon, XIcon } from "@/components/ui/icons";
import { validateEmail } from "@/lib/validation";
import { partnersService } from "@/services/partners.service";
import { cn } from "@/utils/cn";
import type { PartnerApplyInput, PartnerType } from "@/types/partner";

/**
 * Partner application (PRD 7.1): company details, CAC / equivalent documents, TIN, contact, capabilities.
 * The admin reviews each application; approved partners receive their credentials.
 *
 * Flow: 1) POST the application once  2) upload the CAC and TIN documents.
 * If a document upload fails AFTER the application was created, the application is not sent again:
 * only the missing documents are retried.
 */

type DocType = "cac" | "tin";
const MAX_FILE_MB = 10;

const TYPES: { id: PartnerType; label: string; desc: string; Icon: typeof StoreIcon }[] = [
  { id: "supplier", label: "Supplier", desc: "Manufacturer or producer selling on Copeland", Icon: StoreIcon },
  { id: "shipping", label: "Delivery partner", desc: "Logistics provider fulfilling shipments", Icon: TruckIcon },
];

const SUGGESTIONS: Record<string, string[]> = {
  supplier: ["Men's wear", "Women's wear", "Kids' wear", "Uniforms & workwear", "Medical scrubs", "Fabric & textiles", "Accessories"],
  shipping: ["Last-mile delivery", "Intercity delivery", "Cross-border", "Same-day delivery"],
};

const INPUT =
  "min-h-touch w-full rounded-md border bg-white px-4 text-sm text-ink placeholder:text-ink-faint transition-colors duration-fast focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:cursor-not-allowed disabled:bg-mist disabled:text-ink-faint";

type Errors = Record<string, string>;

function validate(f: PartnerApplyInput, docs: Partial<Record<DocType, File>>): Errors {
  const e: Errors = {};
  if (f.companyName.trim().length < 2) e.companyName = "Enter your registered company name.";
  if (!/^[A-Za-z0-9/-]{5,20}$/.test(f.cacNumber.replace(/\s/g, ""))) e.cacNumber = "Enter a valid CAC number, for example RC1234567.";
  if (!/^[A-Za-z0-9-]{8,20}$/.test(f.tin.replace(/\s/g, ""))) e.tin = "Enter a valid TIN, for example 12345678-0001.";
  if (f.contactName.trim().length < 2) e.contactName = "Enter the contact person's full name.";
  const mail = validateEmail(f.contactEmail.trim());
  if (mail) e.contactEmail = mail;
  if (f.contactPhone.replace(/\D/g, "").length < 10) e.contactPhone = "Enter a valid phone number.";
  if (f.address.trim().length < 8) e.address = "Enter your full business address.";
  if (f.capabilities.length === 0) e.capabilities = "Select or add at least one capability.";
  if (!docs.cac) e.docCac = "Upload your CAC certificate.";
  if (!docs.tin) e.docTin = "Upload your TIN document.";
  return e;
}

export default function PartnerApplicationForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [formData, setFormData] = useState<PartnerApplyInput>({
    companyName: "",
    businessName: "",
    cacNumber: "",
    tin: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    capabilities: [],
    partnerType: typeParam === "shipping" ? "shipping" : "supplier",
  });
  const [docs, setDocs] = useState<Partial<Record<DocType, File>>>({});
  const [uploaded, setUploaded] = useState<Partial<Record<DocType, boolean>>>({});
  const [capInput, setCapInput] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false); // the application itself has been created
  const [success, setSuccess] = useState(false);
  const [docsPending, setDocsPending] = useState(false);

  const type = formData.partnerType;
  const typeLabel = type === "shipping" ? "delivery partner" : "supplier";
  const locked = applied; // company and contact details are fixed once the application exists

  function setField(name: keyof PartnerApplyInput, value: string) {
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  }

  function toggleCapability(cap: string) {
    setFormData((p) => ({
      ...p,
      capabilities: p.capabilities.includes(cap) ? p.capabilities.filter((c) => c !== cap) : [...p.capabilities, cap],
    }));
    if (errors.capabilities) setErrors((p) => ({ ...p, capabilities: "" }));
  }

  function addCustomCapability() {
    const v = capInput.trim();
    if (!v) return;
    if (!formData.capabilities.some((c) => c.toLowerCase() === v.toLowerCase())) toggleCapability(v);
    setCapInput("");
  }

  function chooseFile(t: DocType, file: File | undefined) {
    const key = t === "cac" ? "docCac" : "docTin";
    if (!file) return;
    const okType = file.type === "application/pdf" || file.type.startsWith("image/");
    if (!okType) return setErrors((p) => ({ ...p, [key]: "Please choose a PDF, JPG or PNG file." }));
    if (file.size > MAX_FILE_MB * 1024 * 1024) return setErrors((p) => ({ ...p, [key]: `File is too large. The limit is ${MAX_FILE_MB} MB.` }));
    setDocs((p) => ({ ...p, [t]: file }));
    setUploaded((p) => ({ ...p, [t]: false }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function removeFile(t: DocType) {
    setDocs((p) => ({ ...p, [t]: undefined }));
    setUploaded((p) => ({ ...p, [t]: false }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const found = validate(formData, docs);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      dispatch(showAlert({ kind: "error", title: "Form error", message: "Please check the highlighted fields and try again." }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      // 1) The application, sent only once.
      if (!applied) {
        await partnersService.apply({
          ...formData,
          companyName: formData.companyName.trim(),
          businessName: formData.businessName?.trim() || formData.companyName.trim(),
          cacNumber: formData.cacNumber.replace(/\s/g, ""),
          tin: formData.tin.replace(/\s/g, ""),
          contactName: formData.contactName.trim(),
          contactEmail: formData.contactEmail.trim(),
          contactPhone: formData.contactPhone.trim(),
          address: formData.address.trim(),
        });
        setApplied(true);
      }
    } catch (err) {
      dispatch(
        showAlert({
          kind: "error",
          title: "Application failed",
          message: err instanceof Error && err.message ? err.message : "We could not submit your application. Please try again.",
        }),
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      setLoading(false);
      return;
    }

    // 2) The documents. Only the ones not yet uploaded are (re)tried.
    const todo = (["cac", "tin"] as DocType[]).filter((t) => !uploaded[t] && docs[t]);
    const results = await Promise.allSettled(todo.map((t) => partnersService.uploadDocument(t, docs[t]!)));
    const nextUploaded = { ...uploaded };
    let failed = 0;
    results.forEach((r, i) => {
      if (r.status === "fulfilled") nextUploaded[todo[i]!] = true;
      else failed += 1;
    });
    setUploaded(nextUploaded);
    setLoading(false);

    if (failed > 0) {
      dispatch(
        showAlert({
          kind: "warning",
          title: "Documents missing",
          message: `Your application was received, but ${failed === 1 ? "one document" : `${failed} documents`} could not be uploaded. Please try again or continue.`,
        }),
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSuccess(true);
    dispatch(showAlert({ kind: "success", title: "Application received", message: `Thank you for applying to join Copeland as a ${typeLabel}.` }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------------------------------------------------------------- success
  if (success) {
    return (
      <div className="mx-auto max-w-xl py-8 text-center sm:py-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ink">
          <CheckIcon className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <h2 className="mt-6 font-serif text-3xl font-semibold text-ink">Application received</h2>
        <p className="mt-3 text-ink-soft">
          Thank you for applying to join Copeland as a {typeLabel}.
          {docsPending && " We still need one or more of your documents, and our team will contact you about them."}
        </p>

        <ol className="mx-auto mt-8 max-w-md space-y-4 text-left">
          {[
            ["Our team reviews your application", "We check your company details and documents."],
            ["You hear from us by email", `We will write to ${formData.contactEmail.trim() || "your contact email"} with our decision.`],
            ["Approved partners get their login details", "You can then sign in and get started."],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-gold-300">{i + 1}</span>
              <span>
                <span className="block text-sm font-semibold text-ink">{title}</span>
                <span className="block text-sm text-ink-soft">{body}</span>
              </span>
            </li>
          ))}
        </ol>

        <button type="button" onClick={() => router.push("/")} className={btn("primary", "lg", "mt-10")}>
          Back to home
        </button>
      </div>
    );
  }

  // ------------------------------------------------------------------- form
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Who is applying */}
      <div role="radiogroup" aria-label="I am applying as" className="grid gap-3 sm:grid-cols-2">
        {TYPES.map(({ id, label, desc, Icon }) => {
          const active = type === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={locked}
              onClick={() => setFormData((p) => ({ ...p, partnerType: id, capabilities: [] }))}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-fast",
                active ? "border-gold bg-white shadow-card ring-2 ring-gold/30" : "border-line bg-white hover:border-gold/50",
                locked && "cursor-not-allowed opacity-70",
              )}
            >
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", active ? "bg-navy text-gold-300" : "bg-mist text-ink-soft")}>
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{label}</span>
                <span className="mt-0.5 block text-xs text-ink-soft">{desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* What to have ready */}
      <div className="rounded-xl border border-gold/30 bg-gold-50 p-4 text-sm text-ink-soft">
        <p className="font-semibold text-ink">Before you start, have these ready</p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
          {["Your CAC certificate", "Your TIN document", "A contact person's details"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <CheckIcon className="h-3.5 w-3.5 shrink-0 text-gold-700" strokeWidth={3} /> {t}
            </li>
          ))}
        </ul>
      </div>

      <Section step={1} title="Company details" desc="As they appear on your registration documents.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Registered company name" id="companyName" required error={errors.companyName}>
            <input id="companyName" className={cn(INPUT, errors.companyName ? "border-danger" : "border-line")} value={formData.companyName} disabled={locked}
              onChange={(e) => setField("companyName", e.target.value)} placeholder="e.g. Copeland Textiles Ltd" autoComplete="organization" />
          </Field>
          <Field label="Trading name" id="businessName" hint="Leave blank if it is the same as the company name.">
            <input id="businessName" className={cn(INPUT, "border-line")} value={formData.businessName ?? ""} disabled={locked}
              onChange={(e) => setField("businessName", e.target.value)} placeholder="e.g. Copeland Africa" />
          </Field>
          <Field label="CAC registration number" id="cacNumber" required error={errors.cacNumber}>
            <input id="cacNumber" className={cn(INPUT, errors.cacNumber ? "border-danger" : "border-line")} value={formData.cacNumber} disabled={locked}
              onChange={(e) => setField("cacNumber", e.target.value)} placeholder="RC1234567" />
          </Field>
          <Field label="Tax identification number (TIN)" id="tin" required error={errors.tin}>
            <input id="tin" className={cn(INPUT, errors.tin ? "border-danger" : "border-line")} value={formData.tin} disabled={locked}
              onChange={(e) => setField("tin", e.target.value)} placeholder="12345678-0001" />
          </Field>
        </div>
      </Section>

      <Section step={2} title="Contact details" desc="We will use these to reach you about your application.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contact person" id="contactName" required error={errors.contactName}>
            <input id="contactName" className={cn(INPUT, errors.contactName ? "border-danger" : "border-line")} value={formData.contactName} disabled={locked}
              onChange={(e) => setField("contactName", e.target.value)} placeholder="Full name" autoComplete="name" />
          </Field>
          <Field label="Contact email" id="contactEmail" required error={errors.contactEmail}>
            <input id="contactEmail" type="email" className={cn(INPUT, errors.contactEmail ? "border-danger" : "border-line")} value={formData.contactEmail} disabled={locked}
              onChange={(e) => setField("contactEmail", e.target.value)} placeholder="name@company.com" autoComplete="email" />
          </Field>
          <Field label="Phone number" id="contactPhone" required error={errors.contactPhone}>
            <input id="contactPhone" type="tel" className={cn(INPUT, errors.contactPhone ? "border-danger" : "border-line")} value={formData.contactPhone} disabled={locked}
              onChange={(e) => setField("contactPhone", e.target.value)} placeholder="+234 801 234 5678" autoComplete="tel" />
          </Field>
          <Field label="Business address" id="address" required error={errors.address}>
            <input id="address" className={cn(INPUT, errors.address ? "border-danger" : "border-line")} value={formData.address} disabled={locked}
              onChange={(e) => setField("address", e.target.value)} placeholder="Street, city, state" autoComplete="street-address" />
          </Field>
        </div>
      </Section>

      <Section step={3} title="What you do" desc={type === "shipping" ? "Choose the services and routes you cover." : "Choose the kinds of products you make or supply."}>
        <div className="flex flex-wrap gap-2">
          {[...SUGGESTIONS[type]!, ...formData.capabilities.filter((c) => !SUGGESTIONS[type]!.includes(c))].map((cap) => {
            const on = formData.capabilities.includes(cap);
            return (
              <button
                key={cap}
                type="button"
                aria-pressed={on}
                disabled={locked}
                onClick={() => toggleCapability(cap)}
                className={cn(
                  "inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors duration-fast",
                  on ? "border-navy bg-navy text-white" : "border-line bg-white text-ink-soft hover:border-gold hover:text-ink",
                  locked && "cursor-not-allowed opacity-70",
                )}
              >
                {on && <CheckIcon className="h-3.5 w-3.5 text-gold-300" strokeWidth={3} />}
                {cap}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            aria-label="Add another capability"
            className={cn(INPUT, "border-line")}
            value={capInput}
            disabled={locked}
            onChange={(e) => setCapInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomCapability();
              }
            }}
            placeholder="Something else? Type it and press Add"
          />
          <button type="button" onClick={addCustomCapability} disabled={locked || !capInput.trim()} className={btn("subtle", "md", "shrink-0")}>
            Add
          </button>
        </div>
        {errors.capabilities && <FieldError>{errors.capabilities}</FieldError>}
      </Section>

      <Section step={4} title="Verification documents" desc={`PDF, JPG or PNG, up to ${MAX_FILE_MB} MB each.`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FileField label="CAC certificate" file={docs.cac} done={uploaded.cac} error={errors.docCac} onPick={(f) => chooseFile("cac", f)} onRemove={() => removeFile("cac")} />
          <FileField label="TIN document" file={docs.tin} done={uploaded.tin} error={errors.docTin} onPick={(f) => chooseFile("tin", f)} onRemove={() => removeFile("tin")} />
        </div>
      </Section>

      <div className="space-y-3 pt-2">
        <SubmitButton loading={loading} loadingText={applied ? "Uploading documents…" : "Submitting application…"}>
          {applied ? "Retry document upload" : "Submit application"}
        </SubmitButton>
        {applied && (
          <button
            type="button"
            onClick={() => {
              setDocsPending(true);
              setSuccess(true);
            }}
            className="block w-full text-center text-sm font-semibold text-gold-700 hover:text-gold-800"
          >
            Continue without uploading
          </button>
        )}
        <p className="text-center text-xs text-ink-faint">
          Our team reviews every application. By submitting, you confirm the information above is accurate.
        </p>
      </div>
    </form>
  );
}

// ------------------------------------------------------------------ pieces

function Section({ step, title, desc, children }: { step: number; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-7">
      <div className="mb-5 flex items-start gap-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-gold-300">{step}</span>
        <div>
          <h3 className="font-serif text-xl font-semibold leading-tight text-ink">{title}</h3>
          {desc && <p className="mt-0.5 text-sm text-ink-soft">{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
      <AlertIcon className="h-3 w-3 shrink-0" />
      {children}
    </p>
  );
}

function Field({ label, id, hint, error, required, children }: { label: string; id: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-gold-700"> *</span>}
      </label>
      {children}
      {error ? <FieldError>{error}</FieldError> : hint && <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

function FileField({
  label,
  file,
  done,
  error,
  onPick,
  onRemove,
}: {
  label: string;
  file?: File;
  done?: boolean;
  error?: string;
  onPick: (f: File | undefined) => void;
  onRemove: () => void;
}) {
  const size = file ? (file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`) : "";
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-ink">
        {label} <span className="text-gold-700">*</span>
      </p>

      {file ? (
        <div className={cn("flex items-center gap-3 rounded-lg border p-3.5", done ? "border-success/40 bg-success-soft/40" : "border-gold/50 bg-gold-50")}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
            <CheckIcon className="h-4 w-4" strokeWidth={3} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-ink">{file.name}</span>
            <span className="block text-xs text-ink-soft">{done ? "Uploaded" : size}</span>
          </span>
          {!done && (
            <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-white hover:text-danger">
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-6 text-center transition-colors duration-fast hover:border-gold hover:bg-gold-50/50 focus-within:border-gold",
            error ? "border-danger" : "border-line",
          )}
        >
          <input type="file" accept=".pdf,image/*" className="sr-only" onChange={(e) => onPick(e.target.files?.[0])} />
          <UploadIcon className="h-7 w-7 text-gold-700" />
          <span className="mt-2 text-sm font-semibold text-ink">Choose a file</span>
          <span className="text-xs text-ink-faint">PDF, JPG or PNG</span>
        </label>
      )}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}