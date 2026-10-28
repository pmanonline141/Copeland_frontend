import { ShieldCheckIcon } from "./icons";
import { cn } from "@/utils/cn";

const badgeTones = {
  navy: "bg-navy text-white ring-1 ring-gold/70",
  gold: "bg-gold-sheen text-ink ring-1 ring-gold-700/30",
  light: "bg-white/95 text-ink ring-1 ring-gold/60",
} as const;

/**
 * The Copeland badge — "reviewed, approved, Copeland accountable".
 * Navy fill + gold ring follows the reversed logo, per the brand guidelines.
 * Keep the look in one place so every surface matches.
 */
export function CopelandBadge({
  tone = "navy",
  label = "Copeland badge",
  className,
}: {
  tone?: keyof typeof badgeTones;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em]",
        badgeTones[tone],
        className,
      )}
    >
      <ShieldCheckIcon className="h-3.5 w-3.5" strokeWidth={2} />
      {label}
    </span>
  );
}

const pillTones = {
  neutral: "bg-neutral-soft text-neutral",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  gold: "bg-gold-100 text-gold-700",
} as const;

export type PillTone = keyof typeof pillTones;

/** Small status chip mapped to the PRD statuses (draft / live / pending ...). */
export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: PillTone;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", pillTones[tone], className)}>
      {children}
    </span>
  );
}
