import { ApiResponse } from "@/lib/api-response";
import { Collaborator } from "@/types/collaborator";

export async function getCollaborator(
  id: string,
): Promise<ApiResponse<Collaborator>> {
  if (!id || id === "undefined") {
    return ApiResponse.failure("ID de colaborador no válido.");
  }

  try {
    const res = await fetch(`/api/colaboradores/${id}`, {
      method: "GET",
    });

    const resData = await res.json();
    return resData as ApiResponse<Collaborator>;
  } catch (error) {
    return ApiResponse.failure("Error inesperado al obtener el colaborador.");
  }
}
