 import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon, AwardIcon, RulerIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { btn } from "@/components/ui/button";
import { imageUrl } from "@/utils/image";

/**
 * MVP: three promises only. Re-add "Sourced responsibly" (and the tier list / "Read the standards" link)
 * once /about/standards exists and the claims can be backed up.
 */
const STANDARDS = [
  { title: "Reviewed before it is listed", body: "Every Copeland item is inspected and approved by our team first.", Icon: ShieldCheckIcon },
  { title: "Meets its tier standard", body: "Each tier carries a published quality standard.", Icon: AwardIcon },
  { title: "Fit and fabric are specified", body: "Composition, measurements and care are documented.", Icon: RulerIcon },
];

// Temporary generated image. Swap for a real photo later (a local import's `.src` or any URL works).
const IMAGE = imageUrl(
  "luxury fashion editorial still life, a tailored deep navy blazer with fine gold stitching on a mannequin, dramatic soft side lighting, dark elegant background, high-end brand campaign photography",
  "portrait_4_3",
);

export default function CopelandLabel() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid bg-grid-44 opacity-60" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_30rem_at_75%_10%,rgb(183_141_68/0.22),transparent_60%),radial-gradient(40rem_26rem_at_-5%_100%,rgb(255_255_255/0.06),transparent_60%)]" />

      <div className="container relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-16">
        {/* Copy */}
        <Reveal>
          <p className="eyebrow !text-gold-300">Copeland · Private label</p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-[1.05] sm:text-5xl">
            The Copeland label
          </h2>
          <p className="mt-5 max-w-xl text-base text-white/75 sm:text-lg">
            Our own range, held to a standard we publish. It starts deliberately small, with a tightly controlled
            luxury tier.
          </p>

          <ul className="mt-8 grid max-w-xl gap-5">
            {STANDARDS.map(({ title, body, Icon }) => (
              <li key={title} className="flex gap-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/40 bg-white/5 text-gold-300">
                  <Icon className="h-[1.1rem] w-[1.1rem]" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{title}</span>
                  <span className="mt-0.5 block text-sm text-white/65">{body}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <Link href="/copeland" className={btn("gold", "lg", "group")}>
              Explore the label
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-base ease-out-soft group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* Image.
            Height is capped by the viewport on desktop (min of 34rem and screen height minus header and padding),
            so the whole picture, the heading and the button are visible together. Width follows the column. */}
        <Reveal delay={120}>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Offset gold frame (desktop only, kept inside the container so it never touches the screen edge) */}
            <div aria-hidden className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-2xl border border-gold/30 lg:block" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-elevated lg:aspect-auto lg:h-[min(32rem,calc(100svh-11rem))]">
              <img
                src={IMAGE}
                alt="A tailored Copeland label blazer on a mannequin"
                loading="lazy"
                decoding="async"
                style={{ objectPosition: "center 30%" }}
                className="h-full w-full object-cover"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-serif text-xl text-white">Fewer styles. Higher specification.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}