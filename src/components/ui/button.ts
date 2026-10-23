import { cn } from "@/utils/cn";

const base =
  "inline-flex min-h-touch items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors duration-fast ease-out-soft disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-ink text-white hover:bg-ink-soft", // main action on light pages
  gold: "bg-gold text-ink hover:bg-gold-400", // main action on navy sections
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-white",
  outlineLight: "border border-white/30 text-white hover:border-gold hover:text-gold", // on navy
  ghost: "text-ink hover:bg-mist",
} as const;

const sizes = { md: "", lg: "min-h-[3.25rem] px-7 text-base" } as const;

/** Class names for buttons and button-looking links:  <Link className={btn("primary", "lg")}>Shop</Link> */
export function btn(variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md", extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}
