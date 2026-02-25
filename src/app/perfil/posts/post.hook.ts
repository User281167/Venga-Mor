import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchPosts,
  updatePostDescription,
} from "@/app/perfil/posts/post-handler";
import { PostData } from "@/types/post";
import { useUser } from "@/context/user-context";
import { BusinessError } from "@/errors/errors";

const queryKey = ["personal-posts", "feed"];

export function usePostsFeed() {
  const { user } = useUser();

  return useInfiniteQuery({
    queryKey: [...queryKey, user?.uid],
    queryFn: async ({ pageParam }) => {
      const result = await fetchPosts(pageParam);

      if (!result.success || !result.data) {
        throw new BusinessError(result.message || "Error al cargar posts");
      }

      return result.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastId : undefined;
    },
    initialPageParam: null as string | null,
    enabled: !!user, // ← Solo ejecuta si hay usuario autenticado
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 60, // 1 hora
  });
}

// Hook para invalidar posts cuando sea necesario
export function useInvalidatePosts() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return () => {
    queryClient.invalidateQueries({
      queryKey: [...queryKey, user?.uid],
    });
  };
}

// Hook para agregar un post optimísticamente
export function useAddPostOptimistic() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return (newPost: PostData) => {
    queryClient.setQueryData([...queryKey, user?.uid], (old: any) => {
      if (!old?.pages) return old;

      return {
        ...old,
        pages: [
          {
            data: [newPost, ...old.pages[0].data],
            hasMore: old.pages[0].hasMore,
            lastId: old.pages[0].lastId,
          },
          ...old.pages.slice(1),
        ],
      };
    });
  };
}

export function useUpdatePostDescription() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const key = [...queryKey, user?.uid];

  return useMutation({
    mutationFn: async ({
      postId,
      descripcion,
    }: {
      postId: string;
      descripcion: string;
    }) => {
      const result = await updatePostDescription(postId, descripcion);

      if (!result.success) {
        throw new BusinessError(result.message || "Error al actualizar");
      }
      return result;
    },

    // Antes de la llamada — actualiza UI inmediatamente
    onMutate: async ({ postId, descripcion }) => {
      await queryClient.cancelQueries({ queryKey: key });

      // Guarda snapshot para rollback
      const snapshot = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: PostData) =>
              post.id === postId ? { ...post, descripcion } : post,
            ),
          })),
        };
      });

      return { snapshot };
    },

    // Si falla — revierte al snapshot
    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(key, context.snapshot);
      }
    },

    // Si éxito — sincroniza con servidor
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
