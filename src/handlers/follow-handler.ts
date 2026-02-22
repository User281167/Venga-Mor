import { FollowerModel, FollowingModel } from "@/models/follow.model";
import { PaginationDto } from "@/dtos/pagination.dto";
import { ApiResponse } from "@/lib/api-response";
import { api } from "@/lib/apiHelper";

// Verificar si sigo a un colaborador
export async function getMyFollowStatus(
  colaboradorId: string,
): Promise<ApiResponse<FollowingModel>> {
  if (!colaboradorId.trim()) {
    return ApiResponse.failure("ID de colaborador requerido");
  }

  return api.get<FollowingModel>(`/api/me/following/${colaboradorId}`);
}

// Seguir a un colaborador
export async function followCollaborator(
  colaboradorId: string,
): Promise<ApiResponse<null>> {
  if (!colaboradorId.trim()) {
    return ApiResponse.failure("ID de colaborador requerido");
  }

  return api.post<null>(`/api/colaboradores/${colaboradorId}/follow/me`);
}

// Dejar de seguir a un colaborador
export async function unfollowCollaborator(
  colaboradorId: string,
): Promise<ApiResponse<undefined>> {
  if (!colaboradorId.trim()) {
    return ApiResponse.failure("ID de colaborador requerido");
  }

  return api.del(`/api/colaboradores/${colaboradorId}/follow/me`);
}

// Obtener mis seguidos (con paginación)
export async function getMyFollowing(
  lastId?: string | null,
): Promise<ApiResponse<PaginationDto<FollowingModel>>> {
  const url = new URL("/api/me/following", window.location.origin);

  if (lastId) {
    url.searchParams.set("lastId", lastId);
  }

  return api.get<PaginationDto<FollowingModel>>(url.toString());
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

  return api.get<PaginationDto<FollowerModel>>(url.toString());
}
