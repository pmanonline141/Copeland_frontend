import Link from "next/link";
import { btn } from "@/components/ui/button";
import { cn } from "@/utils/cn";

/**
 * Consistent page title block for every dashboard screen.
 * `back` renders a small link above the title.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  back,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="link-underline mb-2 inline-block text-xs font-medium text-ink-faint hover:text-ink">
            ← {back.label}
          </Link>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-1 font-serif text-2xl text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Standard "primary action" link for a page header. */
export function HeaderAction({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={btn("primary", "sm")}>
      {children}
    </Link>
  );
}
