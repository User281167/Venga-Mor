import { UserDto } from "@/dtos/user.dto";
import { ApiResponse } from "@/lib/api-response";

export async function getUserProfile(): Promise<ApiResponse<UserDto>> {
  const resUser = await fetch(`/api/usuarios`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return (await resUser.json()) as ApiResponse<UserDto>;
}
