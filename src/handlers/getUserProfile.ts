import { AppUser } from "@/types/user";
import { ApiResponse } from "@/lib/api-response";

export async function getUserProfile(): Promise<ApiResponse<AppUser>> {
  const resUser = await fetch(`/api/usuarios`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return (await resUser.json()) as ApiResponse<AppUser>;
}
