import { NetworkError, ServerError } from "@/errors/errors";
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
    throw new NetworkError("Error de red, inténtalo de nuevo más tarde");
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
      throw new ServerError("Error del servidor, inténtalo de nuevo más tarde");
    }

    // 4xx → error de negocio (return)
    return json;
  }

  return json;
}
