import { FollowerModel, FollowingModel } from "@/app/models/follow.model";
import { PaginationDto } from "@/dtos/pagination.dto";
import { BusinessError } from "@/errors/errors";
import { ApiResponse } from "@/lib/api-response";

// --- Local fetchApi con credenciales ---
async function fetchApi<T>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Siempre incluir credenciales
  });

  const json = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !json.success) {
    throw new BusinessError(json.message || "Ocurrió un error en la petición.");
  }
  return json;
}
// --- Fin de local fetchApi ---

// Verificar si sigo a un colaborador
export async function getMyFollowStatus(
  colaboradorId: string,
): Promise<ApiResponse<FollowingModel>> {
  if (!colaboradorId.trim()) {
    return ApiResponse.failure("ID de colaborador requerido");
  }

  return fetchApi<FollowingModel>(`/api/me/following/${colaboradorId}`, {
    method: "GET",
  });
}

// Seguir a un colaborador
export async function followCollaborator(
  colaboradorId: string,
): Promise<ApiResponse<null>> {
  if (!colaboradorId.trim()) {
    return ApiResponse.failure("ID de colaborador requerido");
  }

  return fetchApi<null>(`/api/colaboradores/${colaboradorId}/follow/me`, {
    method: "POST",
  });
}

// Dejar de seguir a un colaborador
export async function unfollowCollaborator(
  colaboradorId: string,
): Promise<ApiResponse<undefined>> {
  if (!colaboradorId.trim()) {
    return ApiResponse.failure("ID de colaborador requerido");
  }

  return fetchApi(`/api/colaboradores/${colaboradorId}/follow/me`, {
    method: "DELETE",
  });
}

// Obtener mis seguidos (con paginación)
export async function getMyFollowing(
  lastId?: string | null,
): Promise<ApiResponse<PaginationDto<FollowingModel>>> {
  const url = new URL("/api/me/following", window.location.origin);

  if (lastId) {
    url.searchParams.set("lastId", lastId);
  }

  return fetchApi<PaginationDto<FollowingModel>>(url.toString(), {
    method: "GET",
  });
}

// Obtener seguidores de un colaborador (con paginación)
export async function getCollaboratorFollowers(
  colaboradorId: string,
  lastId?: string | null,
): Promise<ApiResponse<PaginationDto<FollowerModel>>> {
  if (!colaboradorId.trim()) {
    return ApiResponse.failure("ID de colaborador requerido");
  }

  const url = new URL(
    `/api/colaboradores/${colaboradorId}/followers`,
    window.location.origin,
  );

  if (lastId) {
    url.searchParams.set("lastId", lastId);
  }

  return fetchApi<PaginationDto<FollowerModel>>(url.toString(), {
    method: "GET",
  });
}
