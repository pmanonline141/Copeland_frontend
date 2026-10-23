"use client";
import { useCallback, useEffect, useState } from "react";

/** Counts down from `seconds` after start(); used to stop "resend email" being spammed. */
export function useCooldown(seconds = 30) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const start = useCallback(() => setLeft(seconds), [seconds]);
  return { left, active: left > 0, start };
}
