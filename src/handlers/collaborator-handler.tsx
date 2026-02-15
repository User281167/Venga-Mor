import { ApiResponse } from "@/lib/api-response";
import { CollaboratorInfo } from "@/schema/collaborator";

async function requestCollaborator(
  method: "POST" | "PUT",
  data: CollaboratorInfo,
): Promise<ApiResponse<CollaboratorInfo>> {
  try {
    const res = await fetch("/api/colaborador", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
      credentials: "include", // Incluir credenciales (cookies)
    });

    const json = await res.json();
    return json as ApiResponse<CollaboratorInfo>;
  } catch {
    return ApiResponse.failure("Error inesperado al procesar el colaborador.");
  }
}

export function createCollaborator(data: CollaboratorInfo) {
  return requestCollaborator("POST", data);
}

export function updateCollaborator(data: CollaboratorInfo) {
  return requestCollaborator("PUT", data);
}

export async function getCollaborator(): Promise<
  ApiResponse<CollaboratorInfo>
> {
  try {
    const res = await fetch("/api/colaborador", {
      method: "GET",
      credentials: "include", // Incluir credenciales (cookies)
    });

    const resData = await res.json();
    return resData as ApiResponse<CollaboratorInfo>;
  } catch (error) {
    return ApiResponse.failure("Error inesperado al obtener el colaborador.");
  }
}
