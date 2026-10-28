 import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { Pill } from "@/components/ui/Badge";
import { ArrowRightIcon, CheckIcon, ShieldCheckIcon, StoreIcon } from "@/components/ui/icons";
import { btn } from "@/components/ui/button";

/** PRD 7.6: the four promises of the Copeland badge. Keep this wording in step with the PRD and /about/badge. */
const PROMISES = [
  "The item was reviewed and approved by Copeland",
  "It meets the quality standard of its tier",
  "Copeland is accountable for quality, fit and delivery issues",
  "The information on the listing is accurate",
];

export default function BadgeExplainer() {
  return (
    <section className="bg-mist py-16 sm:py-20">
      <div className="container grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-navy p-8 text-white shadow-elevated sm:p-10">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid bg-grid-44 opacity-50" />
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />

              <div className="relative">
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 bg-white/5 text-gold-300">
                  <span aria-hidden className="absolute inset-0 animate-float rounded-full border border-gold/20" />
                  <ShieldCheckIcon className="h-8 w-8" strokeWidth={1.6} />
                </span>

                <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-300">The Copeland badge</p>
                <h3 className="mt-2 font-serif text-3xl">What the badge promises</h3>

                <ul className="mt-6 space-y-3">
                  {PROMISES.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                        <CheckIcon className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Non-badged contrast card (PRD: basic platform moderation only, lower accountability signal) */}
            <div className="relative z-10 -mt-6 ml-auto w-[86%] rounded-xl border border-line bg-paper p-5 shadow-card-hover sm:-mt-8 sm:w-[70%]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-soft text-neutral">
                  <StoreIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Supplier listings</p>
                  <p className="text-xs text-ink-faint">Without the badge</p>
                </div>
                <Pill tone="neutral" className="ml-auto">Basic moderation</Pill>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                Listed by verified suppliers after basic platform moderation. The badge promise does not apply, and the
                supplier&apos;s name is shown on the listing.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            eyebrow="Trust & moderation"
            title="Know who stands behind what you buy"
            description="The Copeland badge is a specific promise, and it is only applied after our team has reviewed and approved the item."
          />

          <dl className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <dt className="font-serif text-xl text-ink">A person reviews it</dt>
              <dd className="mt-2 text-sm text-ink-soft">
                Suppliers submit items to a moderation queue. Nothing goes live until our team has approved it.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-xl text-ink">One place to turn to</dt>
              <dd className="mt-2 text-sm text-ink-soft">
                For badged items, Copeland is your first point of contact if something is wrong with quality, fit or
                delivery.
              </dd>
            </div>
          </dl>

          {/* MVP: one clear action. Add a "Returns & disputes" button here once /returns exists. */}
          <div className="mt-10">
            <Link href="/about/badge" className={btn("primary", "lg", "group")}>
              What the badge means
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-base ease-out-soft group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}