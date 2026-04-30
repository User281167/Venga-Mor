import { CollaboratorResDto } from "@/dtos/collaborator";
import { apiFetch } from "@/lib/apiFetch";
import { ApiResponse } from "@/lib/api-response";

export async function getRankingCollaborators(
  lastId: string | null,
): Promise<ApiResponse<CollaboratorResDto>> {
  const url = lastId ? `/api/ranking?lastId=${lastId}` : "/api/ranking";
  return apiFetch<CollaboratorResDto>(url);
}
