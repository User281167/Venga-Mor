import { ApiResponse } from "@/lib/api-response";
import { CollaboratorInfo } from "@/schema/collaborator";
import { api } from "@/lib/apiHelper";

async function requestCollaborator(
  method: "POST" | "PUT",
  data: CollaboratorInfo,
): Promise<ApiResponse<CollaboratorInfo>> {
  const body = { data };
  if (method === "POST") {
    return api.post<CollaboratorInfo>("/api/colaborador", body);
  } else {
    return api.put<CollaboratorInfo>("/api/colaborador", body);
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
  return api.get<CollaboratorInfo>("/api/colaborador");
}
