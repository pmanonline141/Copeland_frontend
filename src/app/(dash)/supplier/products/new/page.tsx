 "use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import PageHeader from "@/components/dashboard/PageHeader";
import { Notice } from "@/components/auth/fields";
import { btn } from "@/components/ui/button";
import { AlertIcon, CheckIcon, UploadIcon, XIcon } from "@/components/ui/icons";
import { productsService } from "@/services/products.service";
import type { ProductInput } from "@/types/product";
import { getErrorMessage } from "@/services/apiClient";
import { cn } from "@/utils/cn";

const MIN_IMAGES = 3;
const MAX_IMAGES = 10;
const MAX_IMAGE_MB = 10;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const CATEGORIES = [
  "Men's wear",
  "Women's wear",
  "Kids' wear",
  "Uniforms & workwear",
  "Medical scrubs",
  "Fabric & textiles",
  "Accessories",
];
const QUICK_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const INPUT =
  "min-h-12 w-full rounded-lg border bg-white px-3.5 text-base text-ink placeholder:text-ink-faint transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:bg-mist disabled:text-ink-soft";

type Errors = Partial<Record<"name" | "description" | "category" | "price" | "moq" | "quantity" | "images", string>>;

const splitList = (value: string) => value.split(",").map((v) => v.trim()).filter(Boolean);

export default function NewSupplierProductPage() {
  return (
    <DashboardGuard roles={["supplier"]}>
      <NewProductForm />
    </DashboardGuard>
  );
}

function NewProductForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [quantity, setQuantity] = useState("");
  const [colours, setColours] = useState("");
  const [sizes, setSizes] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [savedProductId, setSavedProductId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>("");

  const disabled = busy || savedProductId !== null;

  const clear = (key: keyof Errors) => setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));

  /** Adds photos from the picker or a drop, with the same checks either way. */
  const addImages = (incoming: File[]) => {
    if (incoming.length === 0) return;
    const invalid = incoming.find((f) => !IMAGE_TYPES.includes(f.type) || f.size > MAX_IMAGE_MB * 1024 * 1024);
    if (invalid) {
      setErrors((e) => ({
        ...e,
        images: !IMAGE_TYPES.includes(invalid.type)
          ? "Choose JPG, PNG or WebP product images."
          : `Each image must be ${MAX_IMAGE_MB} MB or smaller.`,
      }));
      return;
    }
    if (images.length + incoming.length > MAX_IMAGES) {
      setErrors((e) => ({ ...e, images: `You can upload up to ${MAX_IMAGES} product images.` }));
      return;
    }
    clear("images");
    setImages((current) => [...current, ...incoming]);
  };

  const chooseImages = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    addImages(selected);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    addImages(Array.from(event.dataTransfer.files ?? []));
  };

  const makeCover = (index: number) =>
    setImages((current) => {
      const next = [...current];
      const [picked] = next.splice(index, 1);
      return [picked, ...next];
    });

  const toggleSize = (size: string) => {
    const list = splitList(sizes);
    const next = list.includes(size) ? list.filter((s) => s !== size) : [...list, size];
    setSizes(next.join(", "));
  };

  const priceValid = /^\d+(\.\d{1,2})?$/.test(price) && Number(price) > 0;
  const checklist = useMemo(
    () => [
      { label: "Product name", done: name.trim().length > 0 },
      { label: "Description", done: description.trim().length > 0 },
      { label: "Category", done: category !== "" },
      { label: "Price", done: priceValid },
      { label: `At least ${MIN_IMAGES} photos`, done: images.length >= MIN_IMAGES },
    ],
    [name, description, category, priceValid, images.length],
  );
  const remaining = checklist.filter((c) => !c.done).length;

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = "Give your product a name.";
    if (!description.trim()) next.description = "Add a short description.";
    if (!category) next.category = "Choose a category.";
    if (!priceValid) next.price = "Enter a valid price with up to 2 decimal places.";
    if (moq && (!Number.isSafeInteger(Number(moq)) || Number(moq) < 1)) next.moq = "Use a whole number of 1 or more.";
    if (quantity && (!Number.isSafeInteger(Number(quantity)) || Number(quantity) < 0)) next.quantity = "Use a whole number, zero or more.";
    if (images.length < MIN_IMAGES) next.images = `Add at least ${MIN_IMAGES} product photos to submit for review.`;
    return next;
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // A draft that was already saved only needs to be re-submitted, so skip field checks.
    if (!savedProductId) {
      const found = validate();
      setErrors(found);
      const first = Object.keys(found)[0];
      if (first) {
        document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        document.getElementById(`field-${first}`)?.focus?.();
        return;
      }
    }

    const priceValue = Number(price);
    const moqValue = moq ? Number(moq) : undefined;
    const quantityValue = quantity ? Number(quantity) : 0;

    setBusy(true);
    let draftSaved = savedProductId !== null;
    try {
      let productId = savedProductId;
      if (!productId) {
        const imageUrls: string[] = [];
        for (let i = 0; i < images.length; i++) {
          setUploadStep(`Uploading photo ${i + 1} of ${images.length}…`);
          imageUrls.push(await productsService.uploadImage(images[i]));
        }

        setUploadStep("Saving your product…");
        const input: ProductInput = {
          name: name.trim(),
          description: description.trim(),
          category,
          priceKobo: Math.round(priceValue * 100),
          moq: moqValue,
          quantityAvailable: quantityValue,
          colours: splitList(colours),
          sizes: splitList(sizes),
          images: imageUrls,
        };
        const product = await productsService.create(input);
        productId = product.id;
        draftSaved = true;
        setSavedProductId(product.id);
      }

      setUploadStep("Sending for review…");
      await productsService.submit(productId);
      router.replace("/supplier#products");
    } catch (submitError) {
      setError(
        draftSaved
          ? `Your product is saved as a draft, but submission failed. Try again to send it for review. ${getErrorMessage(submitError)}`
          : getErrorMessage(submitError),
      );
    } finally {
      setBusy(false);
      setUploadStep("");
    }
  };

  const selectedSizes = splitList(sizes);

  return (
    <>
      <PageHeader
        eyebrow="Supplier catalogue"
        title="Upload a new product"
        description="Add your product details and photos. Copeland reviews every listing before it appears in the catalogue."
        back={{ href: "/supplier#products", label: "Back to your products" }}
      />

      <form onSubmit={submit} noValidate className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-6">
          {error && <Notice tone="error">{error}</Notice>}
          {savedProductId && (
            <Notice tone="warning">
              Your product details and photos are saved. Retry submission to send it for moderation without uploading everything again.
            </Notice>
          )}

          {/* 1 — Details */}
          <Section step={1} title="Product details" hint="The essentials buyers need to understand what you are selling.">
            <Field id="field-name" label="Product name" error={errors.name}>
              <input
                id="field-name"
                maxLength={200}
                value={name}
                onChange={(e) => { setName(e.target.value); clear("name"); }}
                className={cn(INPUT, errors.name ? "border-danger" : "border-line")}
                placeholder="e.g. Cotton work shirt"
                disabled={disabled}
              />
            </Field>

            <Field id="field-description" label="Description" error={errors.description} hint={`${description.length.toLocaleString("en-NG")} / 10,000`}>
              <textarea
                id="field-description"
                maxLength={10000}
                value={description}
                onChange={(e) => { setDescription(e.target.value); clear("description"); }}
                className={cn(INPUT, "min-h-32 py-3", errors.description ? "border-danger" : "border-line")}
                placeholder="Describe the material, fit, quality and any other useful details."
                disabled={disabled}
              />
            </Field>

            <Field id="field-category" label="Category" error={errors.category}>
              <select
                id="field-category"
                value={category}
                onChange={(e) => { setCategory(e.target.value); clear("category"); }}
                className={cn(INPUT, errors.category ? "border-danger" : "border-line")}
                disabled={disabled}
              >
                <option value="">Choose a category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </Section>

          {/* 2 — Pricing & stock */}
          <Section step={2} title="Pricing and stock" hint="Prices are per item. Wholesale buyers use the minimum order quantity.">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id="field-price" label="Price per item" error={errors.price}>
                <div className="relative">
                  <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft">₦</span>
                  <input
                    id="field-price"
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); clear("price"); }}
                    className={cn(INPUT, "pl-8", errors.price ? "border-danger" : "border-line")}
                    placeholder="0.00"
                    disabled={disabled}
                  />
                </div>
              </Field>
              <Field id="field-moq" label="Minimum order" optional error={errors.moq}>
                <input
                  id="field-moq"
                  inputMode="numeric"
                  value={moq}
                  onChange={(e) => { setMoq(e.target.value); clear("moq"); }}
                  className={cn(INPUT, errors.moq ? "border-danger" : "border-line")}
                  placeholder="e.g. 10"
                  disabled={disabled}
                />
              </Field>
              <Field id="field-quantity" label="Available stock" error={errors.quantity}>
                <input
                  id="field-quantity"
                  inputMode="numeric"
                  value={quantity}
                  onChange={(e) => { setQuantity(e.target.value); clear("quantity"); }}
                  className={cn(INPUT, errors.quantity ? "border-danger" : "border-line")}
                  placeholder="0"
                  disabled={disabled}
                />
              </Field>
            </div>
          </Section>

          {/* 3 — Variants */}
          <Section step={3} title="Sizes and colours" hint="Optional. Helps buyers choose the right variant.">
            <Field id="field-sizes" label="Sizes" optional>
              <div className="mb-2 flex flex-wrap gap-2">
                {QUICK_SIZES.map((s) => {
                  const on = selectedSizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      disabled={disabled}
                      aria-pressed={on}
                      className={cn(
                        "min-h-9 min-w-11 rounded-full border px-3 text-sm font-medium transition-colors disabled:opacity-60",
                        on ? "border-navy bg-navy text-white" : "border-line bg-white text-ink-soft hover:border-gold",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <input
                id="field-sizes"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                className={cn(INPUT, "border-line")}
                placeholder="Or type your own, comma-separated: 38, 40, 42"
                disabled={disabled}
              />
            </Field>
            <Field id="field-colours" label="Colours" optional>
              <input
                id="field-colours"
                value={colours}
                onChange={(e) => setColours(e.target.value)}
                className={cn(INPUT, "border-line")}
                placeholder="Navy, Black, Ivory"
                disabled={disabled}
              />
            </Field>
          </Section>

          {/* 4 — Photos */}
          <Section step={4} title="Product photos" hint={`Upload ${MIN_IMAGES}–${MAX_IMAGES} clear JPG, PNG or WebP images, up to ${MAX_IMAGE_MB} MB each. The first photo is the cover.`}>
            <label
              id="field-images"
              tabIndex={0}
              onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                dragging ? "border-gold bg-gold/10" : errors.images ? "border-danger bg-danger/5" : "border-line bg-paper hover:border-gold",
                disabled && "pointer-events-none opacity-60",
              )}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-gold-300">
                <UploadIcon className="h-5 w-5" />
              </span>
              <span className="mt-3 text-sm font-semibold text-ink">Drag photos here, or click to choose</span>
              <span className="mt-1 text-xs text-ink-faint">
                {images.length} of {MAX_IMAGES} selected · at least {MIN_IMAGES} required
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={chooseImages}
                className="sr-only"
                disabled={disabled || images.length >= MAX_IMAGES}
              />
            </label>
            {errors.images && <FieldError>{errors.images}</FieldError>}

            {images.length > 0 && (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image, index) => (
                  <li key={`${image.name}-${image.lastModified}-${index}`} className="group relative overflow-hidden rounded-lg border border-line bg-mist">
                    <ProductImagePreview file={image} />
                    {index === 0 ? (
                      <span className="absolute left-2 top-2 rounded-full bg-navy px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-300">
                        Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makeCover(index)}
                        disabled={disabled}
                        className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[0.65rem] font-semibold text-ink opacity-100 shadow-card transition-opacity hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                      >
                        Make cover
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label={`Remove ${image.name}`}
                      disabled={disabled}
                      onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy/80 text-white backdrop-blur transition-colors hover:bg-danger disabled:opacity-60"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        {/* Side panel */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-line bg-paper p-5 shadow-card">
            <h2 className="font-serif text-lg font-semibold text-ink">Ready to submit?</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {remaining === 0 ? "Everything required is in place." : `${remaining} ${remaining === 1 ? "thing" : "things"} left to add.`}
            </p>
            <ul className="mt-4 space-y-2.5">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      c.done ? "bg-gold text-ink" : "border border-line bg-white text-transparent",
                    )}
                  >
                    <CheckIcon className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className={c.done ? "text-ink" : "text-ink-soft"}>{c.label}</span>
                </li>
              ))}
            </ul>

            <button type="submit" disabled={busy} className={btn("primary", "lg", "mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60")}>
              {busy ? uploadStep || "Working…" : savedProductId ? "Retry submission" : "Submit for review"}
            </button>
            <Link href="/supplier#products" className={btn("subtle", "md", "mt-2 w-full")}>
              Cancel
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h3 className="text-sm font-semibold text-ink">What happens next</h3>
            <ol className="mt-3 space-y-3 text-sm text-ink-soft">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-gold-300">1</span>
                You submit the listing.
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-gold-300">2</span>
                Copeland reviews the photos, details and price.
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-gold-300">3</span>
                Approved listings go live in the catalogue.
              </li>
            </ol>
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-mist p-3 text-xs text-ink-soft">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Clear, well-lit photos on a plain background are approved fastest.
            </p>
          </div>
        </aside>
      </form>
    </>
  );
}

/* ----------------------------- building blocks ----------------------------- */

function Section({ step, title, hint, children }: { step: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white shadow-card">
      <header className="flex items-start gap-4 border-b border-line px-5 py-4 sm:px-6">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-gold-300">{step}</span>
        <div>
          <h2 className="font-serif text-lg font-semibold text-ink">{title}</h2>
          {hint && <p className="mt-0.5 text-sm text-ink-soft">{hint}</p>}
        </div>
      </header>
      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label} {optional && <span className="font-normal text-ink-faint">(optional)</span>}
        </label>
        {hint && <span className="text-xs text-ink-faint">{hint}</span>}
      </div>
      <div className="mt-1.5">{children}</div>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

function FieldError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
      <AlertIcon className="h-3.5 w-3.5 shrink-0" />
      {children}
    </p>
  );
}

/** Square preview. Creates the object URL in an effect so React strict mode cannot revoke it early. */
function ProductImagePreview({ file }: { file: File }) {
  const [url, setUrl] = useState<string | null>(null);
  const created = useRef<string | null>(null);

  useEffect(() => {
    const next = URL.createObjectURL(file);
    created.current = next;
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);

  return (
    <div className="aspect-square w-full">
      {url && <img src={url} alt="" className="h-full w-full object-cover" />}
    </div>
  );
}