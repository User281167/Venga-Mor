import { apiFetch } from "./apiFetch";

export const api = {
  get: <T>(url: string, init: RequestInit = {}) =>
    apiFetch<T>(url, { ...init, method: "GET" }),

  post: <T, B>(url: string, body: B, init: RequestInit = {}) =>
    apiFetch<T>(url, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T, B>(url: string, body: B, init: RequestInit = {}) =>
    apiFetch<T>(url, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T, B>(url: string, body: B, init: RequestInit = {}) =>
    apiFetch<T>(url, {
      ...init,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  del: (url: string, init: RequestInit = {}) =>
    apiFetch<undefined>(url, { ...init, method: "DELETE" }),
};
