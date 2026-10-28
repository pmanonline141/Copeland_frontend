import { cn } from "@/utils/cn";
import { PackageIcon } from "@/components/ui/icons";

export default function EmptyState({
  title,
  body,
  action,
  icon,
  className,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper/60 px-6 py-12 text-center", className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist text-ink-faint">
        {icon ?? <PackageIcon className="h-6 w-6" strokeWidth={1.5} />}
      </span>
      <p className="mt-4 font-serif text-lg text-ink">{title}</p>
      {body && <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
