import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/lib/api-response";
import { PostListDto } from "@/dtos/post.dto";
import { fetchPublicPosts } from "./fetchPublicPosts";

export function usePublicPosts(collaboratorId: string) {
  return useInfiniteQuery<ApiResponse<PostListDto>, Error>({
    queryKey: ["public-posts", collaboratorId],
    queryFn: async ({ pageParam = null }) =>
      fetchPublicPosts(collaboratorId, pageParam as string),
    getNextPageParam: (lastPage) =>
      lastPage.success && lastPage.data?.hasMore
        ? lastPage.data.lastId
        : undefined,
    initialPageParam: null,
    enabled: !!collaboratorId,
    staleTime: 1000 * 60 * 5,
  });
}
