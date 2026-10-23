import { cn } from "@/utils/cn";

const sizes = { sm: "h-4 w-4 border-2", md: "h-6 w-6 border-2", lg: "h-10 w-10 border-[3px]" } as const;

interface SpinnerProps {
  size?: keyof typeof sizes;
  /** Text for screen readers (not shown). */
  label?: string;
  className?: string;
}

/** Inline loader: use inside buttons, cards, tables. Inherits the text colour. */
export default function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex items-center", className)}>
      <span className={cn("inline-block animate-spin rounded-full border-current border-t-transparent", sizes[size])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
