import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AlertKind = "success" | "error" | "info" | "warning";

export interface Alert {
  id: string;
  kind: AlertKind;
  message: string;
  title?: string;
  /** Milliseconds before it disappears. 0 = stays until dismissed. */
  duration: number;
}
export type AlertInput = Omit<Alert, "id" | "duration"> & { duration?: number };

interface UiState {
  alerts: Alert[];
  /** Number of running tasks that want the full-screen loader. Above 0 = visible. */
  loadingCount: number;
}

const initialState: UiState = { alerts: [], loadingCount: 0 };

const MAX_ALERTS = 4;
let seq = 0;

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showAlert: {
      reducer(state, action: PayloadAction<Alert>) {
        state.alerts.push(action.payload);
        if (state.alerts.length > MAX_ALERTS) state.alerts.shift();
      },
      prepare(input: AlertInput) {
        return { payload: { ...input, id: `alert-${Date.now()}-${seq++}`, duration: input.duration ?? (input.kind === "error" ? 7000 : 5000) } };
      },
    },
    dismissAlert(state, action: PayloadAction<string>) {
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
    },
    clearAlerts(state) {
      state.alerts = [];
    },
    startLoading(state) {
      state.loadingCount += 1;
    },
    stopLoading(state) {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
  },
});

export const { showAlert, dismissAlert, clearAlerts, startLoading, stopLoading } = uiSlice.actions;
export default uiSlice.reducer;
