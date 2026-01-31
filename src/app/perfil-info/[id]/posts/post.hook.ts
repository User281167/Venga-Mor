import { useInfiniteQuery } from "@tanstack/react-query";
import { PostListDto } from "@/dtos/post.dto";
import { fetchPublicPosts } from "./fetchPublicPosts";

export function usePublicPosts(collaboratorId: string) {
  return useInfiniteQuery<PostListDto, Error>({
    queryKey: ["public-posts", collaboratorId],
    queryFn: async ({ pageParam = null }) => {
      const res = await fetchPublicPosts(collaboratorId, pageParam as string);

      if (!res.success || !res.data) {
        throw new Error(res.message || "Error al cargar posts");
      }

      return res.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastId : undefined,
    initialPageParam: null,
    enabled: !!collaboratorId,
    staleTime: 1000 * 60 * 5,
  });
}
