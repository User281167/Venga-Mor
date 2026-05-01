import { CollaboratorResDto } from "@/dtos/collaborator";
import { apiFetch } from "@/lib/apiFetch";
import { ApiResponse } from "@/lib/api-response";

export type RankingOrderBy = "estrellas" | "seguidores";

export async function getRankingCollaborators(
  lastId: string | null,
  orderBy: RankingOrderBy,
): Promise<ApiResponse<CollaboratorResDto>> {
  const params = new URLSearchParams();

  params.set("orderby", orderBy);

  if (lastId) {
    params.set("lastId", lastId);
  }

  const url = `/api/ranking?${params.toString()}`;
  return apiFetch<CollaboratorResDto>(url);
}
