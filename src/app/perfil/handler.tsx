import { UpdateUserInfo } from "@/dtos/user.dto";
import { ApiResponse } from "@/lib/api-response";
import { auth } from "@/lib/firebase";
import { CollaboratorInfo } from "@/schema/collaborator";
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

export async function updateImage(file: File): Promise<ApiResponse<string>> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/usuarios/imagen", {
      method: "POST",
      body: formData,
    });

    return (await res.json()) as ApiResponse<string>;
  } catch (error) {
    return ApiResponse.failure("Error inesperado al actulizar la imagen.");
  }
}

export async function createCollaborator(
  data: CollaboratorInfo,
): Promise<ApiResponse<CollaboratorInfo>> {
  try {
    const res = await fetch("/api/colaborador", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    const resData = await res.json();
    return resData as ApiResponse<CollaboratorInfo>;
  } catch (error) {
    return ApiResponse.failure("Error inesperado al crear el colaborador.");
  }
}
