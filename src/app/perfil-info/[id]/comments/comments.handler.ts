import { CommentsDto } from "@/dtos/comments.dto";
import { CommentModel } from "@/types/comment";
import { api } from "@/lib/apiHelper";
import { BusinessError } from "@/errors/errors";

export async function postComment(
  colaboradorId: string,
  content: string,
): Promise<CommentModel | undefined> {
  const trimContent: string = content?.trim().slice(0, 200) ?? "";

  if (!trimContent) {
    throw new BusinessError("El contenido no puede estar vacío"); // ← Throw para TanStack
  }

  const res = await api.post<CommentModel>(
    `/api/colaboradores/${colaboradorId}/comentarios`,
    {
      content: trimContent,
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

  const res = await api.get<CommentsDto>(
    `/api/colaboradores/${colaboradorId}/comentarios?${params.toString()}`,
  );

  return res.data;
}

export async function getMyComment(
  colaboradorId: string,
): Promise<CommentModel | undefined> {
  if (!colaboradorId || !colaboradorId.trim()) {
    throw new BusinessError("El ID del colaborador es requerido");
  }

  const res = await api.get<CommentModel>(
    `/api/colaboradores/${colaboradorId}/comentarios/me`,
  );

  return res.data;
}

export async function deleteMyComment(
  colaboradorId: string,
): Promise<undefined> {
  if (!colaboradorId.trim()) {
    throw new BusinessError("Id necesario para eliminar comentario");
  }

  const res = await api.del(
    `/api/colaboradores/${colaboradorId}/comentarios/me`,
  );

  return res.data;
}
