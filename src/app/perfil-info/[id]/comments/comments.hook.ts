import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getComments, getMyComment, postComment } from "./commentsHandler";
import { useUser } from "@/context/user-context";
import { CommentsDto } from "@/dtos/comments.dto";
import { CommentModel } from "@/types/comment";

// Hook para obtener comentarios con paginación infinita
export function useComments(colaboradorId: string | undefined) {
  return useInfiniteQuery({
    queryKey: ["comments", colaboradorId],
    queryFn: async ({ pageParam }) => {
      if (!colaboradorId) throw new Error("ID de colaborador requerido");
      return await getComments(colaboradorId, pageParam);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastId : undefined;
    },
    initialPageParam: null as string | null,
    enabled: !!colaboradorId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
    retry: (failureCount, error) => {
      if (error.message.includes("no encontrado")) return false;
      return failureCount < 2;
    },
  });
}

// Hook para publicar comentario
export function usePostComment(colaboradorId: string | undefined) {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!colaboradorId) throw new Error("ID de colaborador requerido");
      return await postComment(colaboradorId, content);
    },
    onMutate: async (content) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({
        queryKey: ["comments", colaboradorId],
      });

      // Snapshot del estado anterior
      const previousComments = queryClient.getQueryData<{
        pages: CommentsDto[];
        pageParams: (string | null)[];
      }>(["comments", colaboradorId]);

      // Crear comentario temporal (optimistic)
      const tempComment: CommentModel = {
        id: `temp-${Date.now()}`,
        colaborador_id: colaboradorId!,
        fecha: new Date().toISOString(),
        usuario_id: user?.uid || "temp",
        usuario_nombre: user?.nombre || "Tú",
        contenido: content.trim().slice(0, 200),
      };

      // Actualizar cache optimísticamente
      queryClient.setQueryData<{
        pages: CommentsDto[];
        pageParams: (string | null)[];
      }>(["comments", colaboradorId], (old) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: [
            {
              data: [tempComment, ...old.pages[0].data],
              lastId: old.pages[0].lastId,
              total: old.pages[0].total + 1,
              hasMore: old.pages[0].hasMore,
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousComments };
    },
    onError: (error, variables, context) => {
      // Rollback en caso de error
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", colaboradorId],
          context.previousComments,
        );
      }
    },
    onSuccess: (newComment) => {
      // Reemplazar comentario temporal con el real
      queryClient.setQueryData<{
        pages: CommentsDto[];
        pageParams: (string | null)[];
      }>(["comments", colaboradorId], (old) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              data: [
                newComment,
                ...old.pages[0].data.filter((c) => !c.id.startsWith("temp-")),
              ],
            },
            ...old.pages.slice(1),
          ],
        };
      });
    },
  });
}

// Hook para invalidar comentarios
export function useInvalidateComments() {
  const queryClient = useQueryClient();

  return (colaboradorId: string) => {
    queryClient.invalidateQueries({
      queryKey: ["comments", colaboradorId],
    });
  };
}

export function useMyComment(colaboradorId: string | undefined) {
  const { user } = useUser();

  return useQuery({
    queryKey: ["myComment", colaboradorId],
    queryFn: async () => {
      if (!colaboradorId) throw new Error("ID de colaborador requerido");
      return await getMyComment(colaboradorId);
    },
    enabled: !!colaboradorId && !!user, // Solo si hay usuario autenticado
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}
