/**
 * copeland.africa — Tailwind configuration
 * ------------------------------------------------------------------
 * Source of truth: Brand Guidelines (Oct 2026) + PRD v1.0 + the Brand Assets
 * Package (logo files and README, received 20 Oct 2026).
 *
 * !! READ FIRST !!
 * 1. COLOURS WERE MEASURED FROM THE SUPPLIED LOGO FILES (not guessed), but
 *    they are NOT official codes. The files are compressed JPGs, so values can
 *    be off by a few shades. Ask Jude for the official hex codes, then change
 *    ONLY the BASE values marked below (ink, gold.500, navy.950).
 *    Nothing else in the codebase should hard-code a hex value.
 *
 *    What the real files show (sampled 20 Oct 2026):
 *      Primary logo:   near-black ~#1B1B1B  +  gold ~#B78D44  on white
 *      Reversed logo:  white  +  gold ~#B58B41  on deep navy ~#011332
 *      Single colour:  black ~#020202
 *      Social banner:  navy wordmark ~#12254B (approx), lighter gold ~#C39D5E
 *    NOTE: the Brand Guidelines PDF draws the monogram in navy, but the actual
 *    primary logo is BLACK and gold. Navy appears only as the reversed
 *    background and in the social banner. So: black + gold are the main brand
 *    colours on light surfaces, and navy is the dark-surface colour.
 *
 * 2. FONTS ARE SUGGESTIONS. The guidelines name no brand fonts, and the logo
 *    typeface is not identified. Swap the font variables in the layout file once
 *    the client confirms.
 * 3. Works with Tailwind v3 directly. On Tailwind v4, load this file from your
 *    main CSS with:  @config "../tailwind.config.ts";
 *
 * Brand rules that shaped this file:
 * - Tone is "clear, confident, accountable", not flashy. So: small radii,
 *   soft shadows, restrained motion.
 * - Logo may not be stretched or placed on busy/low-contrast areas, so
 *   no logo animation tokens beyond fade/slide are provided.
 * - Contrast (approximate): gold on white is about 3:1, which FAILS WCAG AA
 *   (4.5:1) for small text. Use ink (black) for text on light backgrounds and
 *   keep gold for borders, icons and large display text. Gold on deep navy is
 *   about 6:1, so gold text is fine on dark sections.
 */

import type { Config } from "tailwindcss";

const config = {
  // Where Tailwind looks for class names. Adjust to your real folder layout
  // (this matches the monorepo suggested earlier: apps/web + packages/shared).
   content: [
  "./app/**/*.{ts,tsx,mdx}",
  "./components/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx,mdx}",
],
  // Class-based dark mode: add class="dark" to <html> to switch.
  // Brand guidelines prefer white/light backgrounds, so light is the default
  // and dark mode is optional. Remove if you decide not to ship it.
  darkMode: "class",

  theme: {
    // ---------------------------------------------------------------
    // SCREENS (mobile-first)
    // Most buyers will be on mid-range Android phones, so design at
    // 360–390px first and treat these as "scale up" breakpoints.
    // ---------------------------------------------------------------
    screens: {
      xs: "360px", // small phones
      sm: "640px", // large phones / small tablets
      md: "768px", // tablets
      lg: "1024px", // laptops
      xl: "1280px", // desktops
      "2xl": "1536px", // large screens
    },

    // Centred page container with comfortable gutters on mobile.
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1360px" },
    },

    extend: {
      // ---------------------------------------------------------------
      // COLOURS
      // ---------------------------------------------------------------
      colors: {
        // NAVY — the DARK-SURFACE colour. This is the background of the
        // reversed logo (white + gold on navy). Use for the footer, hero
        // sections, dark panels and the Copeland badge fill.
        // The lighter steps are for UI tints (hover states, subtle panels).
        navy: {
          50: "#EDF1F8",
          100: "#D5DDEE",
          200: "#AAB9DA",
          300: "#7A8DB8",
          400: "#4F6595",
          500: "#34497A",
          600: "#243662",
          700: "#1A2A52",
          800: "#0F2045",
          900: "#081839",
          950: "#011332", // BASE (measured) — reversed-logo background
          DEFAULT: "#011332",
        },

        // GOLD — accent colour, in every logo variant. Borders, icons, the
        // badge ring, large headings, "LIMITED" and divider lines.
        // Do NOT use for small body text on white (about 3:1 contrast).
        // The social banner uses a slightly lighter gold (~#C39D5E); that is
        // close to gold.400 here. Ask Jude whether it is intentional.
        gold: {
          50: "#FAF6EC",
          100: "#F2E8CF",
          200: "#E6D2A0",
          300: "#D6B870",
          400: "#C6A058",
          500: "#B78D44", // BASE (measured) — main brand gold
          600: "#9A7336",
          700: "#7A5A2C",
          800: "#5F4627",
          900: "#4A3721",
          950: "#291D10",
          DEFAULT: "#B78D44",
        },

        // NEUTRALS — brand guidelines ask for white, light grey or soft
        // off-white backgrounds, especially for product photos.
        ivory: "#FAF8F3", // soft off-white page background
        paper: "#FFFFFF", // cards and product photo backdrops
        mist: "#F1F2F4", // light grey sections, table stripes
        line: "#E3E5E9", // borders and dividers
        // INK — the brand BLACK from the primary logo (~#1B1B1B, a soft black,
        // not pure #000). Use for body text, headings and primary buttons on
        // light backgrounds. (The all-black single-colour logo is ~#020202;
        // that file is for embossing and single-ink printing, not UI text.)
        ink: {
          DEFAULT: "#1B1B1B", // BASE (measured) — brand black
          soft: "#4A4A4A", // secondary text
          faint: "#767676", // captions, placeholders (still readable on white)
        },

        // SEMANTIC — status colours for admin, supplier and order screens.
        // Mapped to the statuses in the PRD so the UI stays consistent.
        //   product:  draft / submitted / live / paused
        //   partner:  pending / approved / rejected
        success: { DEFAULT: "#1F7A4D", soft: "#E6F4EC" }, // live, approved, delivered
        warning: { DEFAULT: "#B7791F", soft: "#FDF3E1" }, // submitted, pending review
        danger: { DEFAULT: "#B42318", soft: "#FDECEA" }, // rejected, failed payment
        info: { DEFAULT: "#1D5FA8", soft: "#E8F1FB" }, // in transit, in production
        neutral: { DEFAULT: "#5B6270", soft: "#EEF0F3" }, // draft, paused

        // Copeland badge (reviewed + approved, Copeland accountable).
        // Kept as its own token so the badge look is controlled in ONE place.
        // No badge artwork was supplied yet. This follows the reversed logo
        // (white + gold on deep navy) so it matches the brand. Confirm with
        // Jude whether the plain CC monogram is the badge.
        badge: {
          ring: "#B78D44", // keep in sync with gold.500
          fill: "#011332", // keep in sync with navy.950
          text: "#FFFFFF",
        },
      },

      // ---------------------------------------------------------------
      // TYPOGRAPHY
      // Fonts come from CSS variables set by next/font in the root layout
      // (e.g. --font-serif, --font-sans). Suggested pairing, not final:
      //   headings: Cormorant Garamond or Fraunces  (refined serif)
      //   body/UI:  Inter, Geist or Manrope         (clean sans)
      // ---------------------------------------------------------------
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },

      // Slightly generous line heights for readability on small screens.
      // Format: [size, { lineHeight, letterSpacing }]
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.1rem" }],
        sm: ["0.875rem", { lineHeight: "1.35rem" }],
        base: ["1rem", { lineHeight: "1.6rem" }], // 16px minimum body on mobile
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.85rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "2.35rem", letterSpacing: "-0.015em" }],
        "4xl": ["2.25rem", { lineHeight: "2.7rem", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        // Big editorial headline for the Copeland label section.
        display: ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
      },

      // ---------------------------------------------------------------
      // SHAPE & DEPTH
      // Small radii and soft shadows = calm, professional look.
      // Avoid big pill shapes everywhere; that reads as casual, not premium.
      // ---------------------------------------------------------------
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },

      boxShadow: {
        // Subtle lift for product cards.
        // Shadows use the brand black (rgb 27 27 27) so they stay neutral.
        card: "0 1px 2px rgb(27 27 27 / 0.06), 0 4px 12px rgb(27 27 27 / 0.05)",
        // Hover state for cards.
        "card-hover": "0 2px 4px rgb(27 27 27 / 0.08), 0 12px 28px rgb(27 27 27 / 0.12)",
        // Bottom sheets and dropdowns.
        overlay: "0 8px 30px rgb(27 27 27 / 0.20)",
        // Gold focus ring (visible keyboard focus, WCAG 2.2). rgb = gold.500.
        focus: "0 0 0 3px rgb(183 141 68 / 0.45)",
      },

      // Product photos: front/back/detail shots. Use aspect-product on
      // <img> wrappers so the feed does not jump while images load.
      aspectRatio: {
        product: "4 / 5",
        banner: "16 / 9",
        og: "1200 / 630", // WhatsApp and social share preview size
      },

      // Minimum touch target (44px) — use as min-h-touch / min-w-touch.
      minHeight: { touch: "2.75rem" },
      minWidth: { touch: "2.75rem" },

      // ---------------------------------------------------------------
      // MOTION
      // Rules: animate only transform and opacity (smooth on weak phones),
      // 150–250ms for small interactions, 400–600ms for larger transitions,
      // soft ease-out. Every animation must have a purpose.
      // Always respect prefers-reduced-motion (see globals.css note below).
      // ---------------------------------------------------------------
      transitionDuration: {
        fast: "150ms", // hover, press, toggle
        base: "250ms", // dropdowns, tooltips, small reveals
        slow: "450ms", // page sections, sheets, image reveals
      },

      transitionTimingFunction: {
        // Gentle ease-out: fast start, soft landing.
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
        // For elements leaving the screen.
        "in-soft": "cubic-bezier(0.64, 0, 0.78, 0)",
      },

      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // Content rising slightly into place (feed cards, section reveals).
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // Mobile filter panel / "Enquire" bottom sheet.
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        // Skeleton loading shimmer (use instead of spinners for the feed).
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      animation: {
        "fade-in": "fade-in 250ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-up": "fade-up 450ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "sheet-up": "sheet-up 350ms cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.6s linear infinite",
      },

      // Gradient used by the shimmer skeleton. Usage:
      //   <div class="bg-shimmer bg-[length:200%_100%] animate-shimmer" />
      backgroundImage: {
        shimmer:
          "linear-gradient(90deg, #F1F2F4 25%, #FAFAFB 50%, #F1F2F4 75%)",
      },
    },
  },

  // PLUGINS
  // Optional, add when needed:
  //   require("tailwindcss-animate")  // if you use shadcn/ui (v3 setups)
  //   require("@tailwindcss/typography") // for product descriptions / policies
  plugins: [],
} satisfies Config;

export default config;

/**
 * ------------------------------------------------------------------
 * ADD THIS TO globals.css (reduced-motion + focus defaults)
 * ------------------------------------------------------------------
 *
 * @media (prefers-reduced-motion: reduce) {
 *   *, *::before, *::after {
 *     animation-duration: 0.01ms !important;
 *     animation-iteration-count: 1 !important;
 *     transition-duration: 0.01ms !important;
 *     scroll-behavior: auto !important;
 *   }
 * }
 *
 * :focus-visible { @apply outline-none shadow-focus; }
 *
 * ------------------------------------------------------------------
 * QUICK USAGE EXAMPLES
 * ------------------------------------------------------------------
 * Page background:      bg-ivory text-ink
 * Primary button:       bg-ink text-white hover:bg-ink-soft rounded-md
 *                       min-h-touch px-5 transition-colors duration-fast
 *                       (black button on light pages; confirm with the client)
 * Dark section:         bg-navy text-white   (logo: use the REVERSED file)
 * Gold accent border:   border border-gold
 * Product card:         bg-paper rounded-lg shadow-card hover:shadow-card-hover
 *                       transition-shadow duration-base ease-out-soft
 * Product image box:    aspect-product object-cover
 * Status pill (live):   bg-success-soft text-success
 * Status pill (pending):bg-warning-soft text-warning
 * Heading:              font-serif text-3xl text-ink
 * Gold on dark text:    text-gold on bg-navy (about 6:1 contrast, passes AA)
 */