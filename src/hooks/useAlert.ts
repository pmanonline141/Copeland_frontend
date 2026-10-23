"use client";
import { useMemo } from "react";
import { useAppDispatch } from "@/store/hooks";
import { dismissAlert, showAlert, type AlertInput } from "@/store/slices/uiSlice";

type Opts = Partial<Pick<AlertInput, "title" | "duration">>;

/** const alert = useAlert();  alert.success("Saved");  alert.error(getErrorMessage(err)); */
export function useAlert() {
  const dispatch = useAppDispatch();
  return useMemo(() => {
    const make = (kind: AlertInput["kind"]) => (message: string, opts?: Opts) => dispatch(showAlert({ kind, message, ...opts }));
    return {
      success: make("success"),
      error: make("error"),
      info: make("info"),
      warning: make("warning"),
      dismiss: (id: string) => dispatch(dismissAlert(id)),
    };
  }, [dispatch]);
}
