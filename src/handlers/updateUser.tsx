import { UpdateUserInfo } from "@/dtos/user.dto";
import { ApiResponse } from "@/lib/api-response";
import { AppUser } from "@/types/user";

export async function updateUser(
  data: UpdateUserInfo,
): Promise<ApiResponse<AppUser>> {
  try {
    const res = await fetch("/api/usuarios", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Incluir credenciales (cookies)
    });

    return (await res.json()) as ApiResponse<AppUser>;
  } catch (error) {
    return ApiResponse.failure("Error inesperado al actulizar la inforamción.");
  }
}
