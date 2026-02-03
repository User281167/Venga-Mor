import { ApiResponse } from "@/lib/api-response";

export async function apiFetch<T>(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  let res: Response;

  try {
    res = await fetch(input, {
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
      ...init,
    });
  } catch {
    throw new Error("NETWORK_ERROR");
  }

  let json: ApiResponse<T>;

  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    if (res.status === 204 || res.ok) {
      json = ApiResponse.success(undefined as T, "Operación exitosa");
    } else {
      json = ApiResponse.failure<T>("Sin contenido");
    }
  }

  if (!res.ok) {
    // 5xx, 408, 429 → error de red/servidor (throw)
    if (res.status >= 500 || res.status === 408 || res.status === 429) {
      throw new Error(json.message || `HTTP_${res.status}`);
    }

    // 4xx → error de negocio (return)
    return json;
  }

  return json;
}

// ✅ Helper específico para DELETE (no espera data)
export async function apiDelete(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<ApiResponse<void>> {
  return apiFetch<void>(input, { ...init, method: "DELETE" });
}
