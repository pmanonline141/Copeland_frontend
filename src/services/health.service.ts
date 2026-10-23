import { api } from "./apiClient";

export const healthService = { check: () => api.get<{ status: "ok" }>("/health") };
