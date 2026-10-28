import type { SerializedApiError } from "@/services/apiClient";
import { AlertIcon, ArrowRightIcon } from "@/components/ui/icons";
import { btn } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import EmptyState from "./EmptyState";

interface QueryStateProps {
  loading: boolean;
  error: SerializedApiError | null;
  onRetry?: () => void;
  /** Show the empty state instead of children (usually `items.length === 0`). */
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  emptyAction?: React.ReactNode;
  /** Shown while loading. Falls back to a plain spinner line. */
  skeleton?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/** Copy shown when the API base URL has not been configured yet (very common in local dev). */
function errorCopy(error: SerializedApiError): { title: string; body: string } {
  if (error.code === "not_configured") {
    return {
      title: "The Copeland API is not connected",
      body: "Set NEXT_PUBLIC_API_URL in .env.local and restart the dev server to load live data.",
    };
  }
  if (error.status === 403) {
    return { title: "This needs an approved partner account", body: error.message };
  }
  if (error.status === 401) {
    return { title: "Your session has expired", body: "Sign in again to continue." };
  }
  return { title: "We could not load this", body: error.message };
}

/**
 * Standard loading / error / empty handling for a data-driven panel, so every dashboard
 * page behaves the same way instead of each inventing its own.
 */
export default function QueryState({
  loading, error, onRetry, isEmpty, emptyTitle, emptyBody, emptyAction, skeleton, title, children, className,
}: QueryStateProps) {
  if (loading) {
    return <div className={className}>{skeleton ?? <LoadingLine title={title} />}</div>;
  }

  if (error) {
    const copy = errorCopy(error);
    return (
      <div className={cn("flex flex-col items-start gap-3 rounded-lg border border-warning/30 bg-warning-soft/60 p-5", className)}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 text-warning">
            <AlertIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{copy.title}</p>
            <p className="mt-1 text-sm text-ink-soft">{copy.body}</p>
          </div>
        </div>
        {onRetry && (
          <button type="button" onClick={onRetry} className={btn("subtle", "sm", "ml-11")}>
            Try again <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return <EmptyState title={emptyTitle ?? "Nothing here yet"} body={emptyBody} action={emptyAction} className={className} />;
  }

  return <div className={className}>{children}</div>;
}

function LoadingLine({ title }: { title?: string }) {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <span className="sr-only">{title ? `Loading ${title}` : "Loading"}</span>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-10 w-full rounded-md bg-shimmer bg-[length:200%_100%] animate-shimmer" />
      ))}
    </div>
  );
}
