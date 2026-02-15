import { CollaboratorResDto } from "@/dtos/collaborator";
import { ApiResponse } from "@/lib/api-response";
import { LocationData } from "@/types/location-data";

export async function getProfiles(
  minAge: number,
  maxAge: number,
  categories: string[],
  location: LocationData,
  lastId: string | null,
): Promise<ApiResponse<CollaboratorResDto>> {
  try {
    // Simplify the URL to only include pagination, ensuring profiles are loaded.
    let url = "/api/colaboradores";
    if (lastId) {
      url += `?lastId=${lastId}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data as ApiResponse<CollaboratorResDto>;
  } catch (error) {
    return ApiResponse.failure("Error al obtener perfiles");
  }
}
