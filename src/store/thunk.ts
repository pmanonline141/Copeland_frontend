import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SerializedApiError } from "@/services/apiClient";

/**
 * Use instead of createAsyncThunk so every failure has the same shape (SerializedApiError):
 *
 *   export const doThing = createAppThunk("x/doThing", async (arg: Input, { rejectWithValue }) => {
 *     try { return await service.call(arg); } catch (e) { return rejectWithValue(serializeError(e)); }
 *   });
 */
export const createAppThunk = createAsyncThunk.withTypes<{ rejectValue: SerializedApiError }>();

/** Error to store from a rejected thunk (rejectValue, or a serialized fallback when the thunk threw). */
export function errorFrom(action: { payload?: SerializedApiError; error: { message?: string } }): SerializedApiError {
  return action.payload ?? { status: 0, code: "unknown", message: action.error.message ?? "Something went wrong. Please try again." };
}
