import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "@/app/perfil/posts/post-handler";
import { PostData } from "@/types/post";
import { useUser } from "@/context/user-context";

const queryKey = ["personal-posts", "feed"];

export function usePostsFeed() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: [...queryKey, user?.uid], // ← Incluye user.uid en la key
    queryFn: async ({ pageParam }) => {
      const result = await fetchPosts(pageParam);

      if (!result.success || !result.data) {
        throw new Error(result.message || "Error al cargar posts");
      }

      return result.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastId : undefined;
    },
    initialPageParam: null as string | null,
    enabled: !!user, // ← Solo ejecuta si hay usuario autenticado
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
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
