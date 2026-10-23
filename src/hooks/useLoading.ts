"use client";
import { useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { startLoading, stopLoading } from "@/store/slices/uiSlice";

/**
 * Wraps an async task with the full-screen loader. The loader always turns off, even if the task throws.
 *   const withLoading = useLoading();
 *   await withLoading(() => api.post("/api/orders", body));
 * For a spinner inside a button or card, use <Spinner /> with local state instead.
 */
export function useLoading() {
  const dispatch = useAppDispatch();
  return useCallback(
    async <T,>(task: () => Promise<T>): Promise<T> => {
      dispatch(startLoading());
      try {
        return await task();
      } finally {
        dispatch(stopLoading());
      }
    },
    [dispatch],
  );
}
