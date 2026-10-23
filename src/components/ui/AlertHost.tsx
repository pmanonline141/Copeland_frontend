"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { dismissAlert, type Alert } from "@/store/slices/uiSlice";
import { cn } from "@/utils/cn";

const tone: Record<Alert["kind"], string> = {
  success: "border-green-600 bg-green-50 text-green-900",
  error: "border-red-600 bg-red-50 text-red-900",
  warning: "border-amber-500 bg-amber-50 text-amber-900",
  info: "border-sky-600 bg-sky-50 text-sky-900",
};

function AlertItem({ alert }: { alert: Alert }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!alert.duration) return;
    const t = setTimeout(() => dispatch(dismissAlert(alert.id)), alert.duration);
    return () => clearTimeout(t);
  }, [alert.id, alert.duration, dispatch]);

  return (
    <div role={alert.kind === "error" ? "alert" : "status"} className={cn("pointer-events-auto flex items-start gap-3 rounded-md border-l-4 p-3 text-sm shadow-lg", tone[alert.kind])}>
      <div className="min-w-0 flex-1">
        {alert.title && <p className="font-semibold">{alert.title}</p>}
        <p className="break-words">{alert.message}</p>
      </div>
      <button type="button" onClick={() => dispatch(dismissAlert(alert.id))} aria-label="Dismiss" className="shrink-0 px-1 leading-none opacity-60 hover:opacity-100">
        ×
      </button>
    </div>
  );
}

/** Renders every alert in the store. Mounted once in the root layout. Trigger with useAlert() or notify. */
export default function AlertHost() {
  const alerts = useAppSelector((s) => s.ui.alerts);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex flex-col items-stretch gap-2 p-4 sm:left-auto sm:w-96">
      {alerts.map((a) => (
        <AlertItem key={a.id} alert={a} />
      ))}
    </div>
  );
}
