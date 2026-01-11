import { UpdateUserInfo } from "@/dtos/user.dto";
import { ApiResponse } from "@/lib/api-response";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export async function logout(setUser: (user: any) => void) {
  await signOut(auth);
  setUser(null);

  await fetch("/api/id-token", { method: "DELETE" });
}

export async function updateUser(data: UpdateUserInfo): Promise<ApiResponse> {
  try {
    const res = await fetch("/api/usuarios", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return (await res.json()) as ApiResponse;
  } catch (error) {
    return ApiResponse.failure("Error inesperado al actulizar la inforamción.");
  }
}
