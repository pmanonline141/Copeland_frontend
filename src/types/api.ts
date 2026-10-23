/** Error body returned by the Copeland API: { error: { code, message, details? } } */
export interface ApiErrorBody {
  error?: { code?: string; message?: string; details?: unknown };
  message?: string;
  code?: string; // Better Auth errors are { code, message } at the top level
}

/** Shape of paginated list responses. Adjust here if the API differs. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Dates arrive as ISO strings. Money fields ending in `Kobo` are integers (÷100 for naira). */
export type ISODate = string;
export type UUID = string;
/** SQL aggregates (balances, sums) come back as strings to keep integer precision. */
export type KoboString = string;

/** Generic `{ message, ...data }` wrapper some endpoints use. */
export type WithMessage<T = object> = { message: string } & T;
