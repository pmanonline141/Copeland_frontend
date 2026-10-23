"use client";
import { useAppSelector } from "@/store/hooks";
import Spinner from "./Spinner";

/** Full-screen loader. Visible while any task started with useLoading() (or startLoading) is running. */
export default function GlobalLoader() {
  const active = useAppSelector((s) => s.ui.loadingCount > 0);
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/70 text-slate-900 backdrop-blur-sm" aria-busy="true">
      <Spinner size="lg" />
    </div>
  );
}
