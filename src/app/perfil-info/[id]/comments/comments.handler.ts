import { CommentsDto } from "@/dtos/comments.dto";
import { CommentModel } from "@/types/comment";
import { BusinessError } from "@/errors/errors";
import { ApiResponse } from "@/lib/api-response";

async function fetchApi<T>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "same-origin",
  });

  const json = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !json.success) {
    throw new BusinessError(json.message || "Ocurrió un error en la petición.");
  }
  return json;
}

export async function postComment(
  colaboradorId: string,
  content: string,
): Promise<CommentModel | undefined> {
  const trimContent: string = content?.trim().slice(0, 200) ?? "";
  if (!trimContent) {
    throw new BusinessError("El contenido no puede estar vacío");
  }

  const res = await fetchApi<CommentModel>(
    `/api/colaboradores/${colaboradorId}/comentarios`,
    {
      method: "POST",
      body: JSON.stringify({ content: trimContent }),
    },
  );

  return res.data;
}

export async function getComments(
  colaboradorId: string,
  lastId: string | null,
): Promise<CommentsDto | undefined> {
  if (!colaboradorId.trim()) {
    throw new BusinessError("El ID del colaborador es requerido");
  }

  const params = new URLSearchParams();
  if (lastId) {
    params.append("lastId", lastId);
  }

  const res = await fetchApi<CommentsDto>(
    `/api/colaboradores/${colaboradorId}/comentarios?${params.toString()}`,
    { method: "GET" },
  );

  return res.data;
}

export async function getMyComment(
  colaboradorId: string,
): Promise<CommentModel | undefined> {
  if (!colaboradorId || !colaboradorId.trim()) {
    throw new BusinessError("El ID del colaborador es requerido");
  }

  const res = await fetchApi<CommentModel>(
    `/api/colaboradores/${colaboradorId}/comentarios/me`,
    { method: "GET" },
  );

  // Un 404 aquí significa que no hay comentario, no es un error.
  if (res.success === false && res.message === "Comentario no encontrado") {
    return undefined;
  }

  return res.data;
}

export async function deleteMyComment(
  colaboradorId: string,
): Promise<undefined> {
  if (!colaboradorId.trim()) {
    throw new BusinessError("Id necesario para eliminar comentario");
  }

  const res = await fetchApi(
    `/api/colaboradores/${colaboradorId}/comentarios/me`,
    { method: "DELETE" },
  );

  return res.data;
}
