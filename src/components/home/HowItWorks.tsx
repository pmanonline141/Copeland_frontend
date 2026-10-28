import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon, BagIcon, BuildingIcon, CheckIcon, SearchIcon, TruckIcon } from "@/components/ui/icons";
import { btn } from "@/components/ui/button";

/**
 * MVP wording: only what the first release really does (PRD: filters by category, price and badge;
 * simple order / enquiry flow; order tracking). Add detail back as the shipping portal and
 * institutional tools are built (PRD phases 2 and 3).
 */
const STEPS = [
  {
    title: "Discover",
    body: "Browse the catalogue by category or price, or look only at items carrying the Copeland badge.",
    Icon: SearchIcon,
  },
  {
    title: "Order or enquire",
    body: "Add to cart to buy now, or send a quote request when you need larger quantities.",
    Icon: BagIcon,
  },
  {
    title: "Track your order",
    body: "See where your order is, from confirmation through to delivery.",
    Icon: TruckIcon,
  },
];

const INSTITUTION_POINTS = ["Uniform, workwear and bulk orders", "Quotes with clear lead times and minimum quantities"];

export default function HowItWorks() {
  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="From browsing to delivery"
          description="Buying one item or equipping a whole team, the steps are the same."
        />

        {/* Each step is a white card with a border and shadow so it stands out from the page; the navy icon sits on the card's top edge. */}
        <ol className="mt-16 grid gap-x-6 gap-y-14 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90} className="h-full">
              <div className="group relative flex h-full flex-col items-center rounded-2xl border border-line bg-white px-6 pb-8 pt-12 text-center shadow-card transition-all duration-base ease-out-soft hover:-translate-y-1 hover:border-gold/50 hover:shadow-card-hover">
                <span className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-navy text-gold-300 shadow-card ring-4 ring-ivory">
                  <s.Icon className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[0.65rem] font-bold text-ink">
                    {i + 1}
                  </span>
                </span>
                <h3 className="font-serif text-2xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[0.95rem] font-medium leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Institutional panel */}
        <Reveal delay={120}>
          <div className="relative mt-14 overflow-hidden rounded-2xl bg-navy p-8 text-white shadow-elevated sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid bg-grid-44 opacity-50" />
            <div aria-hidden className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />

            <div className="relative max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-300">
                <BuildingIcon className="h-3.5 w-3.5" /> For firms &amp; institutions
              </span>
              <h3 className="mt-4 font-serif text-3xl sm:text-4xl">Buying for a team?</h3>
              <p className="mt-3 text-white/75">Send one request and get a quote, instead of contacting suppliers one by one.</p>
            </div>

            <div className="relative mt-8 lg:mt-0 lg:shrink-0">
              <ul className="space-y-2.5">
                {INSTITUTION_POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                      <CheckIcon className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link href="/rfq" className={btn("gold", "lg", "group mt-6 w-full sm:w-auto")}>
                Request a quote
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-base ease-out-soft group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}