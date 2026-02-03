import { CommentsDto } from "@/dtos/comments.dto";
import { ApiResponse } from "@/lib/api-response";
import { CommentModel } from "@/types/comment";
import { api } from "@/lib/apiHelper";

export async function postComment(
  colaboradorId: string,
  content: string,
): Promise<CommentModel> {
  const trimContent: string = content?.trim().slice(0, 200) ?? "";

  if (!trimContent) {
    throw new Error("El contenido no puede estar vacío"); // ← Throw para TanStack
  }

  try {
    const response = await fetch(
      `/api/colaboradores/${colaboradorId}/comentarios`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: trimContent }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear el comentario");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Error al crear el comentario");
    }

    return result.data;
  } catch (error) {
    // Re-throw para que TanStack Query lo maneje
    throw error instanceof Error
      ? error
      : new Error("Error inesperado al crear el comentario");
  }
}

export async function getComments(
  colaboradorId: string,
  lastId: string | null,
): Promise<CommentsDto> {
  const params = new URLSearchParams();

  if (lastId) {
    params.append("lastId", lastId);
  }

  try {
    const response = await fetch(
      `/api/colaboradores/${colaboradorId}/comentarios?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener los comentarios");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Error al obtener los comentarios");
    }

    return result.data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Error inesperado al obtener los comentarios");
  }
}

export async function getMyComment(
  colaboradorId: string,
): Promise<CommentModel | null> {
  try {
    const response = await fetch(
      `/api/colaboradores/${colaboradorId}/comentarios/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener tu comentario");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Error al obtener tu comentario");
    }

    return result.data; // Puede ser null si no tiene comentario
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Error inesperado al obtener tu comentario");
  }
}

export async function deleteMyComment(
  colaboradorId: string,
): Promise<ApiResponse> {
  if (!colaboradorId.trim()) {
    return ApiResponse.failure("Id necesario para eliminar comentario");
  }

  return api.del(`/api/colaboradores/${colaboradorId}/comentarios/me`);
}
