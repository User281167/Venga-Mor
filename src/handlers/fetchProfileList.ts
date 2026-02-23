import { CollaboratorResDto } from "@/dtos/collaborator";
import { ApiResponse } from "@/lib/api-response";
import { LocationData } from "@/types/location-data";

export async function getProfiles(
  minAge: number,
  maxAge: number,
  categories: string[],
  location: LocationData,
  stars: number | null,
  lastId: string | null,
): Promise<ApiResponse<CollaboratorResDto>> {
  const pais = location.pais || "";
  const estado = location.estado_region || "";
  const ciudad = location.ciudad_localidad || "";
  const starQuery = stars !== null ? `&stars=${stars}` : "";

  try {
    const response = await fetch(
      `/api/colaboradores/?minAge=${minAge}&maxAge=${maxAge}&categories=${categories.join(",")}&location=${pais},${estado},${ciudad}${starQuery}${lastId ? `&lastId=${lastId}` : ""}`,
    );
    const data = await response.json();
    return data as ApiResponse<CollaboratorResDto>;
  } catch (error) {
    return ApiResponse.failure("Error al obtener perfiles");
  }
}
