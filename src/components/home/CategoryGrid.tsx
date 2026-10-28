import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { imageUrl } from "@/utils/image";

const CATEGORIES = [
  {
    label: "Women",
    href: "/shop?category=women",
    image: imageUrl("editorial fashion photograph of elegant West African women's clothing, a flowing ivory dress with fine gold detail on a hanger against a clean light studio backdrop, soft daylight", "portrait_4_3"),
  },
  {
    label: "Men",
    href: "/shop?category=men",
    image: imageUrl("editorial product photograph of a crisp tailored charcoal men's shirt on a wooden hanger against a light grey studio backdrop, soft shadows", "portrait_4_3"),
  },
  {
    label: "Kids",
    href: "/shop?category=kids",
    image: imageUrl("children's clothing neatly folded and arranged on a soft white background, pastel and warm tones, clean catalogue photography", "portrait_4_3"),
  },
  {
    label: "Uniforms & workwear",
    href: "/shop?category=uniforms",
    image: imageUrl("neatly folded corporate uniform set in navy with a blank embroidered chest area, arranged on a light grey surface, product photography", "portrait_4_3"),
  },
  {
    label: "Fabric & textiles",
    href: "/shop?category=fabric",
    image: imageUrl("close-up of stacked premium cotton and African print fabric rolls with fine gold threads, soft daylight, textile detail photography", "portrait_4_3"),
  },
  {
    label: "Accessories",
    href: "/shop?category=accessories",
    image: imageUrl("flat lay of premium accessories, a leather belt, gold cufflinks and a folded silk tie on an ivory surface, minimal product photography", "portrait_4_3"),
  },
];

export default function CategoryGrid() {
  return (
    <section id="categories" className="bg-ivory py-16 sm:py-20">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Shop by category"
            title="From a single shirt to a full uniform programme"
            description="One moderated catalogue for households, firms and institutions — sourced from verified suppliers across Africa and beyond."
          />
          <Link href="/shop" className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
            Browse everything <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal as="li" key={c.label} delay={i * 70}>
              <Link
                href={c.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-mist shadow-card transition-shadow duration-base ease-out-soft hover:shadow-card-hover"
              >
                <img
                  src={c.image}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-slow ease-out-soft group-hover:scale-[1.07]"
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/15 to-transparent" />

                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                  <span className="font-serif text-lg leading-tight text-white sm:text-xl">{c.label}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-colors duration-fast group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
