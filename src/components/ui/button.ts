import { cn } from "@/utils/cn";

const base =
  "inline-flex min-h-touch items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-fast ease-out-soft active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-ink text-white hover:bg-ink-soft shadow-card", // main action on light pages
  gold: "bg-gold text-ink hover:bg-gold-400 shadow-card", // main action on navy sections
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-white",
  outlineLight: "border border-white/30 text-white hover:border-gold hover:text-gold", // on navy
  subtle: "border border-line bg-paper text-ink hover:border-ink/30 hover:shadow-card", // quiet secondary
  ghost: "text-ink hover:bg-mist",
  ghostLight: "text-white/85 hover:bg-white/10 hover:text-white", // on navy
} as const;

const sizes = {
  sm: "min-h-[2.25rem] px-3.5 text-xs",
  md: "",
  lg: "min-h-[3.25rem] px-7 text-base",
} as const;

/** Class names for buttons and button-looking links:  <Link className={btn("primary", "lg")}>Shop</Link> */
export function btn(variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md", extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}
