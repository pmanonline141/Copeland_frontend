"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { serializeError, type SerializedApiError } from "@/services/apiClient";

export interface AsyncResult<T> {
  data: T | null;
  error: SerializedApiError | null;
  loading: boolean;
  /** Re-runs the task (used by "Try again" buttons). */
  reload: () => void;
}

/**
 * Runs an async task on mount and whenever `deps` change, tracking loading and error state.
 *
 *   const { data, error, loading, reload } = useAsync(() => productsService.mine(), []);
 *
 * The latest `task` is always used, so you do not need to memoise the callback.
 */
export function useAsync<T>(task: () => Promise<T>, deps: unknown[] = []): AsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<SerializedApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  const taskRef = useRef(task);
  taskRef.current = task;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    taskRef.current()
      .then((result) => {
        if (alive) setData(result);
      })
      .catch((e: unknown) => {
        if (alive) setError(serializeError(e));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, ...deps]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { data, error, loading, reload };
}
