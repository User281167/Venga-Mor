import { UpdateUserInfo } from "@/dtos/user.dto";
import { ApiResponse } from "@/lib/api-response";
import { AppUser } from "@/types/user";
import { api } from "@/lib/apiHelper";

export async function updateUser(
  data: UpdateUserInfo,
): Promise<ApiResponse<AppUser>> {
  return api.put<AppUser>("/api/usuarios", data);
}
