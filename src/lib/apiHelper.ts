import { apiFetch } from "./apiFetch";

export const api = {
  get: <T>(url: string, init: RequestInit = {}) =>
    apiFetch<T>(url, { ...init, method: "GET" }),

  post: <T, B = undefined>(url: string, body?: B, init: RequestInit = {}) =>
    apiFetch<T>(url, {
      ...init,
      method: "POST",
      body: body ? JSON.stringify(body) : null,
    }),

  put: <T, B>(url: string, body?: B, init: RequestInit = {}) =>
    apiFetch<T>(url, {
      ...init,
      method: "PUT",
      body: body ? JSON.stringify(body) : null,
    }),

  patch: <T, B>(url: string, body?: B, init: RequestInit = {}) =>
    apiFetch<T>(url, {
      ...init,
      method: "PATCH",
      body: body ? JSON.stringify(body) : null,
    }),

  del: (url: string, init: RequestInit = {}) =>
    apiFetch<undefined>(url, { ...init, method: "DELETE" }),
};
