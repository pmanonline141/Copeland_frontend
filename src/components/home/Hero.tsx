import Link from "next/link";
import { ArrowRightIcon, CheckIcon, ShieldCheckIcon, ShirtIcon } from "@/components/ui/icons";
import { btn } from "@/components/ui/button";

const POINTS = ["Every listing is moderated", "The Copeland badge means Copeland is accountable", "Track each order from supplier to door"];

/**
 * The visual on the right is a design placeholder built from CSS only.
 * Swap the two cards for real photography (white/light-grey backdrop, per the photography
 * standards) once the first Copeland luxury and supplier products are shot.
 */
function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0 lg:max-w-[28rem]">
      <div aria-hidden className="absolute -inset-6 rounded-[2rem] border border-gold/30" />

      {/* Main card: Copeland label */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-navy shadow-overlay animate-fade-up">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(28rem_20rem_at_70%_15%,rgb(183_141_68/0.28),transparent_60%)]" />
        <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">Copeland · Luxury tier</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 text-gold-300"><ShieldCheckIcon className="h-5 w-5" /></span>
          </div>
          <ShirtIcon className="mx-auto h-40 w-40 text-gold/55 sm:h-48 sm:w-48" strokeWidth={0.8} />
          <div>
            <p className="font-serif text-2xl text-white sm:text-3xl">Tailored essentials</p>
            <p className="mt-1 text-sm text-white/70">Sample approved in Nigeria before bulk production.</p>
          </div>
        </div>
      </div>

      {/* Supplier card */}
      <div className="absolute -bottom-6 -left-3 w-48 rounded-lg bg-paper p-3 shadow-card-hover animate-fade-up sm:-left-8 sm:w-56" style={{ animationDelay: "150ms" }}>
        <div className="flex aspect-[5/3] items-center justify-center rounded-md bg-mist">
          <ShirtIcon className="h-12 w-12 text-ink-faint" strokeWidth={1} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-ink">Supplier listing</span>
          <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">Moderated</span>
        </div>
      </div>

      {/* Promise chip */}
      <div className="absolute -right-4 top-1/2 hidden items-center gap-2 rounded-full border border-gold/40 bg-paper px-4 py-2 shadow-card animate-fade-up sm:flex" style={{ animationDelay: "300ms" }}>
        <ShieldCheckIcon className="h-4 w-4 text-gold-600" />
        <span className="text-xs font-semibold text-ink">Reviewed · Approved · Accountable</span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_85%_-10%,rgb(183_141_68/0.16),transparent_60%),radial-gradient(40rem_28rem_at_-10%_110%,rgb(1_19_50/0.07),transparent_60%)]" />

      <div className="container relative grid items-center gap-16 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-20">
        <div className="animate-fade-up">
          <p className="eyebrow">Clothing infrastructure · Nigeria &amp; West Africa</p>
          <h1 className="mt-5 text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
            Reliable clothing,
            <span className="block italic text-gold-600">from suppliers you can trust.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-soft">
            Browse moderated garments from verified suppliers, or choose the Copeland label: reviewed, approved and backed by us for quality, fit and delivery.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className={btn("primary", "lg")}>Shop the catalogue <ArrowRightIcon className="h-4 w-4" /></Link>
            <Link href="/rfq" className={btn("outline", "lg")}>Request a bulk quote</Link>
          </div>

          <ul className="mt-10 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-ink-soft sm:text-base">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold-700"><CheckIcon className="h-3.5 w-3.5" strokeWidth={2.2} /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
