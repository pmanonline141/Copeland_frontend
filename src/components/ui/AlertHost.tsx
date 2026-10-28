"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { dismissAlert, type Alert } from "@/store/slices/uiSlice";
import { cn } from "@/utils/cn";
import { AlertIcon, CheckIcon, CloseIcon } from "./icons";

/** Must match the toast-out animation duration in tailwind.config.ts. */
const EXIT_MS = 260;

const tone: Record<Alert["kind"], { bar: string; iconBg: string; iconText: string; icon: ReactNode }> = {
  success: { bar: "bg-success", iconBg: "bg-success-soft", iconText: "text-success", icon: <CheckIcon className="h-4 w-4" strokeWidth={2.4} /> },
  error: { bar: "bg-danger", iconBg: "bg-danger-soft", iconText: "text-danger", icon: <AlertIcon className="h-4 w-4" strokeWidth={2} /> },
  warning: { bar: "bg-warning", iconBg: "bg-warning-soft", iconText: "text-warning", icon: <AlertIcon className="h-4 w-4" strokeWidth={2} /> },
  info: { bar: "bg-info", iconBg: "bg-info-soft", iconText: "text-info", icon: <AlertIcon className="h-4 w-4" strokeWidth={2} /> },
};

function AlertItem({ alert, leaving, onClose }: { alert: Alert; leaving: boolean; onClose: (id: string) => void }) {
  useEffect(() => {
    if (!alert.duration || leaving) return;
    const t = window.setTimeout(() => onClose(alert.id), alert.duration);
    return () => window.clearTimeout(t);
  }, [alert.id, alert.duration, leaving, onClose]);

  const t = tone[alert.kind];
  return (
    <div
      role={alert.kind === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-lg border border-line bg-paper py-3.5 pl-4 pr-2.5 shadow-overlay",
        leaving ? "animate-toast-out" : "animate-toast-in",
      )}
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", t.bar)} />

      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", t.iconBg, t.iconText)}>{t.icon}</span>

        <div className="min-w-0 flex-1">
          {alert.title && <p className="text-sm font-semibold text-ink">{alert.title}</p>}
          <p className="break-words text-sm text-ink-soft">{alert.message}</p>
        </div>

        <button
          type="button"
          onClick={() => onClose(alert.id)}
          aria-label="Dismiss notification"
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-faint transition-colors duration-fast hover:bg-mist hover:text-ink"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Countdown bar: animates from full width to 0 over the alert's lifetime. */}
      {alert.duration > 0 && (
        <span
          aria-hidden
          className={cn("absolute bottom-0 left-0 h-0.5 opacity-70", t.bar)}
          style={{ animation: `toast-timer ${alert.duration}ms linear forwards` }}
        />
      )}
    </div>
  );
}

/**
 * Renders every alert in the store, stacked top-right. Each toast eases in from
 * the right and eases back out on dismiss before it leaves the store, so the
 * exit is animated rather than an abrupt unmount. Mounted once in the root layout.
 */
export default function AlertHost() {
  const alerts = useAppSelector((s) => s.ui.alerts);
  const dispatch = useAppDispatch();
  const [leaving, setLeaving] = useState<string[]>([]);
  const timers = useRef(new Map<string, number>());

  const close = useCallback(
    (id: string) => {
      if (timers.current.has(id)) return;
      setLeaving((prev) => [...prev, id]);
      const timer = window.setTimeout(() => {
        dispatch(dismissAlert(id));
        setLeaving((prev) => prev.filter((x) => x !== id));
        timers.current.delete(id);
      }, EXIT_MS);
      timers.current.set(id, timer);
    },
    [dispatch],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  // Newest first, so the latest toast lands at the top of the stack.
  const ordered = [...alerts].reverse();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex flex-col items-stretch gap-2.5 p-4 sm:inset-x-auto sm:right-0 sm:w-[24rem] sm:max-w-[calc(100vw-2rem)]"
    >
      {ordered.map((a) => (
        <AlertItem key={a.id} alert={a} leaving={leaving.includes(a.id)} onClose={close} />
      ))}
    </div>
  );
}
