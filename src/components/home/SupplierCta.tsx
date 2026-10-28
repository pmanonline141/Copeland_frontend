import Link from "next/link";
import Image from "next/image"; // 1. Add Next.js Image component
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon, CheckIcon, StoreIcon, TruckIcon } from "@/components/ui/icons";
import { btn } from "@/components/ui/button";

// 2. Import your local images
// Adjust the path if your images are in a subfolder like "@/assets/images/supplier.jpg"
import supplierImage from "@/assets/images/supplier-cta.jpg";
import shippingImage from "@/assets/images/shipping-cta.jpg";

/**
 * PRD flows: "Supplier onboarding: Apply > Admin review > Credentials > Upload product > Moderation > Live".
 * The shipping portal is a later phase, so that card is framed as joining the delivery network, and its
 * button is the quieter of the two.
 */
const CARDS = [
  {
    eyebrow: "For suppliers",
    Icon: StoreIcon,
    title: "Sell on Copeland",
    body: "Reach households, firms and institutions across Nigeria and West Africa.",
    points: [
      "Apply with your company details and CAC / TIN documents",
      "Upload products with pricing, MOQ, size run and lead time",
      "Go live once approved, then manage your orders",
    ],
    href: "/partners/apply",
    cta: "Apply as a supplier",
    ctaStyle: "primary" as const,
    image: supplierImage, // 3. Use imported image
    position: "center 40%",
  },
  {
    eyebrow: "For delivery partners",
    Icon: TruckIcon,
    title: "Deliver with Copeland",
    body: "Join our delivery network and give buyers accurate delivery windows.",
    points: [
      "See the shipments assigned to you",
      "Update status from pickup to delivery",
      "Upload supporting documents",
    ],
    href: "/partners/apply?type=shipping",
    cta: "Apply as a delivery partner",
    ctaStyle: "subtle" as const,
    image: shippingImage, // 3. Use imported image
    position: "center 45%",
  },
];

export default function SupplierCta() {
  return (
    <section className="bg-mist py-16 sm:py-20">
      <div className="container">
        <ul className="grid gap-6 lg:grid-cols-2">
          {CARDS.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 90} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition-all duration-base ease-out-soft hover:-translate-y-1 hover:shadow-card-hover">
                <div className="relative aspect-[16/9] overflow-hidden bg-navy">
                  {/* 4. Replace <img> with Next.js <Image> */}
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ objectPosition: c.position }}
                    className="object-cover transition-transform duration-slow ease-out-soft group-hover:scale-[1.05]"
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />

                  <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-navy/70 text-gold-300 backdrop-blur">
                    <c.Icon className="h-5 w-5" />
                  </span>
                  <p className="absolute bottom-4 left-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-300">
                    {c.eyebrow}
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="font-serif text-3xl font-semibold text-ink">{c.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{c.body}</p>

                  <ul className="mt-6 space-y-3">
                    {c.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm font-medium text-ink-soft">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                          <CheckIcon className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>

                  <Link href={c.href} className={btn(c.ctaStyle, "lg", "group mt-auto w-full sm:w-auto")}>
                    {c.cta}
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-base ease-out-soft group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 text-center text-sm text-ink-soft">
          Every application is reviewed by our team before approval.
        </p>
      </div>
    </section>
  );
}