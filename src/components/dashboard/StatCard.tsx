import { cn } from "@/utils/cn";

const tones = {
  default: "bg-mist text-ink-soft",
  gold: "bg-gold-100 text-gold-700",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  navy: "bg-navy text-gold-300",
} as const;

export default function StatCard({
  label,
  value,
  hint,
  Icon,
  tone = "default",
  loading = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone?: keyof typeof tones;
  loading?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-line bg-paper p-5 shadow-card", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
        {Icon && (
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tones[tone])}>
            <Icon className="h-[1.1rem] w-[1.1rem]" />
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-4 h-7 w-20 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer" />
      ) : (
        <p className="mt-3 font-serif text-3xl text-ink">{value}</p>
      )}

      {hint && <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
