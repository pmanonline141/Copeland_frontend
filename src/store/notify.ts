/**
 * Show an alert from code that is NOT a React component (services, thunks, utilities).
 * Inside components prefer the useAlert() hook.
 *
 *   notify.success("Saved");
 *   notify.error(getErrorMessage(err));
 *
 * StoreProvider binds the store's dispatch on the client. Before that (or on the server) calls are ignored.
 */
import { showAlert, type AlertInput } from "./slices/uiSlice";
import type { AppDispatch } from "./index";

let dispatch: AppDispatch | null = null;
export const bindNotify = (d: AppDispatch | null) => {
  dispatch = d;
};

type Opts = Partial<Pick<AlertInput, "title" | "duration">>;
const make = (kind: AlertInput["kind"]) => (message: string, opts?: Opts) => {
  dispatch?.(showAlert({ kind, message, ...opts }));
};

export const notify = {
  success: make("success"),
  error: make("error"),
  info: make("info"),
  warning: make("warning"),
};
