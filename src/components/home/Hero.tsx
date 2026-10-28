// "use client";
// import Link from "next/link";
// import { useCallback, useEffect, useState } from "react";
// import { CopelandBadge } from "@/components/ui/Badge";
// import { btn } from "@/components/ui/button";
// import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@/components/ui/icons";
// import { cn } from "@/utils/cn";
// import { imageUrl } from "@/utils/image";

// /** Keep in sync with the slide-progress animation duration in tailwind.config.ts. */
// const AUTOPLAY_MS = 6500;

// interface Slide {
//   id: string;
//   eyebrow: string;
//   title: React.ReactNode;
//   body: string;
//   image: string;
//   badges?: string[];
//   primary: { label: string; href: string };
//   secondary: { label: string; href: string };
// }

// const SLIDES: Slide[] = [
//   {
//     id: "label",
//     eyebrow: "Copeland · Private label",
//     title: (
//       <>
//         Tailored essentials,
//         <br />
//         <span className="italic text-gold-300">held to a standard we publish.</span>
//       </>
//     ),
//     body: "Our own luxury tier begins deliberately small — few styles, higher specifications, and sample-approved quality before bulk production.",
//     image: imageUrl(
//       "luxury fashion campaign photograph, elegant West African model in a tailored deep navy suit with subtle gold accents, dramatic editorial lighting, full body, dark elegant backdrop, high-end brand campaign, cinematic",
//       "landscape_16_9",
//     ),
//     badges: ["Copeland · Luxury tier"],
//     primary: { label: "Explore the label", href: "/copeland" },
//     secondary: { label: "Shop everything", href: "/shop" },
//   },
//   {
//     id: "marketplace",
//     eyebrow: "Verified suppliers",
//     title: (
//       <>
//         Clothing infrastructure for
//         <br />
//         <span className="italic text-gold-300">Nigeria &amp; West Africa.</span>
//       </>
//     ),
//     body: "Browse a moderated catalogue from verified suppliers — every listing reviewed before it goes live, every order tracked to your door.",
//     image: imageUrl(
//       "wide cinematic photograph of an organised West African garment workshop, fabric rolls and sewing stations, warm daylight through tall windows, documentary style, professional, shallow depth of field",
//       "landscape_16_9",
//     ),
//     badges: ["Moderated", "Tracked delivery"],
//     primary: { label: "Shop the catalogue", href: "/shop" },
//     secondary: { label: "Become a supplier", href: "/partners/apply" },
//   },
//   {
//     id: "institutions",
//     eyebrow: "For firms & institutions",
//     title: (
//       <>
//         Equip a whole team
//         <br />
//         <span className="italic text-gold-300">from one request.</span>
//       </>
//     ),
//     body: "Uniform, workwear and bulk programmes with clear lead times, MOQs and consolidated delivery — one quote instead of chasing suppliers.",
//     image: imageUrl(
//       "wide cinematic photograph of neatly stacked folded uniforms and parcels in a bright modern logistics warehouse, a worker checking a clipboard in the background, professional, warm light",
//       "landscape_16_9",
//     ),
//     badges: ["Bulk & institutional"],
//     primary: { label: "Request a quote", href: "/rfq" },
//     secondary: { label: "How it works", href: "/#categories" },
//   },
// ];

// export default function Hero() {
//   const [index, setIndex] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [reduced, setReduced] = useState(false);

//   const go = useCallback((next: number) => setIndex((next + SLIDES.length) % SLIDES.length), []);

//   // Respect the user's motion preference: no autoplay, no Ken Burns.
//   useEffect(() => {
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     setReduced(mq.matches);
//     const onChange = () => setReduced(mq.matches);
//     mq.addEventListener("change", onChange);
//     return () => mq.removeEventListener("change", onChange);
//   }, []);

//   useEffect(() => {
//     if (paused || reduced) return;
//     const timer = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
//     return () => window.clearInterval(timer);
//   }, [paused, reduced]);

//   const slide = SLIDES[index]!;

//   return (
//     <section
//       aria-roledescription="carousel"
//       aria-label="Featured at Copeland"
//       className="relative isolate flex h-[88svh] min-h-[34rem] w-full items-end overflow-hidden bg-navy text-white"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//       onFocusCapture={() => setPaused(true)}
//       onBlurCapture={() => setPaused(false)}
//     >
//       {/* Slides */}
//       {SLIDES.map((s, i) => {
//         const active = i === index;
//         return (
//           <div
//             key={s.id}
//             aria-hidden={!active}
//             className={cn("absolute inset-0 transition-opacity duration-700 ease-out-soft", active ? "opacity-100" : "opacity-0")}
//           >
//             <img
//               src={s.image}
//               alt=""
//               aria-hidden
//               loading={i === 0 ? "eager" : "lazy"}
//               decoding="async"
//               className={cn("h-full w-full object-cover", active && !reduced && "animate-kenburns")}
//             />
//           </div>
//         );
//       })}

//       {/* Darkening layers so overlay copy stays readable on any image */}
//       <div aria-hidden className="absolute inset-0 bg-navy/55" />
//       <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/25" />
//       <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy via-navy/55 to-transparent" />
//       <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

//       {/* Copy */}
//       <div className="container relative z-10 pb-14 sm:pb-16 lg:pb-20">
//         <div key={slide.id} className="max-w-3xl animate-fade-up">
//           {slide.badges && (
//             <div className="mb-6  flex flex-wrap items-center gap-2">
//               {slide.badges.map((b, i) =>
//                 i === 0 ? (
//                   <CopelandBadge key={b} tone="navy" label={b} />
//                 ) : (
//                   <span key={b} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur">
//                     {b}
//                   </span>
//                 ),
//               )}
//             </div>
//           )}

//           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{slide.eyebrow}</p>

//           <h1 className="mt-4 text-balance font-serif text-[2.4rem] font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
//             {slide.title}
//           </h1>

//           <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">{slide.body}</p>

//           <div className="mt-8 flex flex-col gap-3 sm:flex-row">
//             <Link href={slide.primary.href} className={btn("gold", "lg", "group")}>
//               {slide.primary.label}
//               <ArrowRightIcon className="h-4 w-4 transition-transform duration-base ease-out-soft group-hover:translate-x-1" />
//             </Link>
//             <Link href={slide.secondary.href} className={btn("outlineLight", "lg")}>
//               {slide.secondary.label}
//             </Link>
//           </div>
//         </div>

//         {/* Controls: slide counter, progress, dots, arrows */}
//         <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
//           <span className="font-serif text-sm text-white/70">
//             <span className="text-white">{String(index + 1).padStart(2, "0")}</span> / {String(SLIDES.length).padStart(2, "0")}
//           </span>

//           <div className="flex items-center gap-2">
//             {SLIDES.map((s, i) => (
//               <button
//                 key={s.id}
//                 type="button"
//                 onClick={() => go(i)}
//                 aria-label={`Go to slide ${i + 1}`}
//                 aria-current={i === index}
//                 className={cn(
//                   "h-1.5 rounded-full transition-all duration-base ease-out-soft",
//                   i === index ? "w-8 bg-gold" : "w-4 bg-white/35 hover:bg-white/60",
//                 )}
//               />
//             ))}
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={() => go(index - 1)}
//               aria-label="Previous slide"
//               className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/85 transition-colors duration-fast hover:border-gold hover:bg-white/10 hover:text-white"
//             >
//               <ChevronLeftIcon className="h-5 w-5" />
//             </button>
//             <button
//               type="button"
//               onClick={() => go(index + 1)}
//               aria-label="Next slide"
//               className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/85 transition-colors duration-fast hover:border-gold hover:bg-white/10 hover:text-white"
//             >
//               <ChevronRightIcon className="h-5 w-5" />
//             </button>
//             {!reduced && (
//               <button
//                 type="button"
//                 onClick={() => setPaused((p) => !p)}
//                 aria-label={paused ? "Play slideshow" : "Pause slideshow"}
//                 className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/85 transition-colors duration-fast hover:border-gold hover:bg-white/10 hover:text-white"
//               >
//                 {paused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Autoplay progress */}
//       {!reduced && (
//         <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-0.5 bg-white/15">
//           <div
//             key={index}
//             className="h-full animate-slide-progress bg-gold"
//             style={{ animationPlayState: paused ? "paused" : "running" }}
//           />
//         </div>
//       )}
//     </section>
//   );
// }


"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CopelandBadge } from "@/components/ui/Badge";
import { btn } from "@/components/ui/button";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@/components/ui/icons";
import { cn } from "@/utils/cn";

/** Keep in sync with the slide-progress animation duration in tailwind.config.ts. */
const AUTOPLAY_MS = 6500;

/**
 * BACKGROUND IMAGES
 * Temporary photos from Pexels (free to use). When your own images are ready, put them in
 * src/assets/hero/ and swap each `image:` below for an import, for example:
 *
 *   import labelBg from "@/assets/hero/label.jpg";
 *   ...
 *   image: labelBg.src,
 *
 * Use landscape photos of at least 1920px wide, with the subject away from the left edge
 * (the headline sits on the left). `position` decides which part is kept when the image is cropped.
 */
const pexels = (id: number, width = 1920) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

interface Slide {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  image: string;
  /** CSS object-position for the image, e.g. "center 25%". */
  position?: string;
  badges?: string[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

const SLIDES: Slide[] = [
  {
    id: "label",
    eyebrow: "Copeland · Private label",
    title: (
      <>
        Tailored essentials,
        <br />
        <span className="italic text-gold-300">held to a standard we publish.</span>
      </>
    ),
    body: "Our own luxury tier begins deliberately small — few styles, higher specifications, and sample-approved quality before bulk production.",
    image: pexels(9363150), // man in a suit (portrait photo, cropped to fit)
    position: "center 22%",
    badges: ["Copeland · Luxury tier"],
    primary: { label: "Explore the label", href: "/copeland" },
    secondary: { label: "Shop everything", href: "/shop" },
  },
  {
    id: "marketplace",
    eyebrow: "Verified suppliers",
    title: (
      <>
        Clothing infrastructure for
        <br />
        <span className="italic text-gold-300">Nigeria &amp; West Africa.</span>
      </>
    ),
    body: "Browse a moderated catalogue from verified suppliers — every listing reviewed before it goes live, every order tracked to your door.",
    image: pexels(3965543), // fabric rolls and patterns in a tailor's atelier
    position: "center",
    badges: ["Moderated", "Tracked delivery"],
    primary: { label: "Shop the catalogue", href: "/shop" },
    secondary: { label: "Become a supplier", href: "/partners/apply" },
  },
  {
    id: "institutions",
    eyebrow: "For firms & institutions",
    title: (
      <>
        Equip a whole team
        <br />
        <span className="italic text-gold-300">from one request.</span>
      </>
    ),
    body: "Uniform, workwear and bulk programmes with clear lead times, MOQs and consolidated delivery — one quote instead of chasing suppliers.",
    image: pexels(4483943), // warehouse worker with stacked boxes
    position: "center",
    badges: ["Bulk & institutional"],
    primary: { label: "Request a quote", href: "/rfq" },
    secondary: { label: "How it works", href: "/#categories" },
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const go = useCallback((next: number) => setIndex((next + SLIDES.length) % SLIDES.length), []);

  // Respect the user's motion preference: no autoplay, no Ken Burns.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduced]);

  const slide = SLIDES[index]!;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured at Copeland"
      /*
       * FIX: this used a fixed height (h-[88svh]) with the copy pinned to the bottom. When the copy
       * was taller than the box (short screens, long headlines) its TOP was pushed out of the section
       * and clipped by overflow-hidden, which looked like the navbar was covering it.
       * Now the section only has a MINIMUM height (roughly one screen below the announcement bar and
       * navbar, ~9.5rem) and grows to fit its content, and the copy has top padding as a safety margin.
       */
      className="relative isolate flex min-h-[max(34rem,calc(100svh-9.5rem))] w-full items-end overflow-hidden bg-navy text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Slides */}
      {SLIDES.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.id}
            aria-hidden={!active}
            className={cn("absolute inset-0 transition-opacity duration-700 ease-out-soft", active ? "opacity-100" : "opacity-0")}
          >
            <img
              src={s.image}
              alt=""
              aria-hidden
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding="async"
              style={{ objectPosition: s.position ?? "center" }}
              className={cn("h-full w-full object-cover", active && !reduced && "animate-kenburns")}
            />
          </div>
        );
      })}

      {/* Darkening layers so overlay copy stays readable on any image */}
      {/* Small screens: the copy spans the full width, so use an even wash instead of a side fade. */}
      <div aria-hidden className="absolute inset-0 bg-navy/65 lg:hidden" />
      {/* Large screens: solid navy behind the copy (left), fading to a clear, full-colour photo on the right.
          Tune the stops: lower `via-*%` shows more photo sooner; raise the alphas for stronger text contrast. */}
      <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-navy/95 via-navy/80 via-35% to-transparent to-75% lg:block" />
      {/* Light bottom fade just so the slider controls stay readable */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/80 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      {/* Copy. The top padding guarantees the first line (badge) never touches the edge or the navbar. */}
      <div className="container relative z-10 pb-14 pt-10 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-14">
        <div key={slide.id} className="max-w-3xl animate-fade-up">
          {slide.badges && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {slide.badges.map((b, i) =>
                i === 0 ? (
                  <CopelandBadge key={b} tone="navy" label={b} />
                ) : (
                  <span key={b} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur">
                    {b}
                  </span>
                ),
              )}
            </div>
          )}

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{slide.eyebrow}</p>

          <h1 className="mt-4 text-balance font-serif text-[2.4rem] font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>

          <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">{slide.body}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={slide.primary.href} className={btn("gold", "lg", "group")}>
              {slide.primary.label}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-base ease-out-soft group-hover:translate-x-1" />
            </Link>
            <Link href={slide.secondary.href} className={btn("outlineLight", "lg")}>
              {slide.secondary.label}
            </Link>
          </div>
        </div>

        {/* Controls: slide counter, progress, dots, arrows */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
          <span className="font-serif text-sm text-white/70">
            <span className="text-white">{String(index + 1).padStart(2, "0")}</span> / {String(SLIDES.length).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-base ease-out-soft",
                  i === index ? "w-8 bg-gold" : "w-4 bg-white/35 hover:bg-white/60",
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/85 transition-colors duration-fast hover:border-gold hover:bg-white/10 hover:text-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/85 transition-colors duration-fast hover:border-gold hover:bg-white/10 hover:text-white"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/85 transition-colors duration-fast hover:border-gold hover:bg-white/10 hover:text-white"
              >
                {paused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Autoplay progress */}
      {!reduced && (
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-0.5 bg-white/15">
          <div
            key={index}
            className="h-full animate-slide-progress bg-gold"
            style={{ animationPlayState: paused ? "paused" : "running" }}
          />
        </div>
      )}
    </section>
  );
}