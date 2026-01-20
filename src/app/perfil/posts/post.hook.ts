import { PostData } from "@/types/post";
import { useState, useEffect, useCallback } from "react";
import { fetchPosts } from "./post-handler";
import { PostListDto } from "@/dtos/post.dto";
import { ApiResponse } from "@/lib/api-response";

export const usePostsFeed = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [lastId, setLastId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(
    async (isFirstLoad: boolean = false) => {
      if (isLoading || (!hasMore && !isFirstLoad)) return;

      setIsLoading(true);
      setError(null);

      // Si es carga inicial, no enviamos lastId
      const currentLastId = isFirstLoad ? null : lastId;
      const result: ApiResponse<PostListDto> = await fetchPosts(currentLastId);

      if (result.success && result.data) {
        const data: PostListDto = result.data;

        setPosts((prev) => (isFirstLoad ? data.data : [...prev, ...data.data]));
        setLastId(data.lastId);
        setHasMore(data.hasMore);
      }

      setIsLoading(false);
    },
    [lastId, hasMore, isLoading],
  );

  // Carga inicial
  useEffect(() => {
    loadPosts(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setError(null), 2000);
    return () => clearTimeout(timeoutId);
  }, [error]);

  return {
    posts,
    isLoading,
    hasMore,
    error,
    loadMore: () => loadPosts(false),
    refresh: () => loadPosts(true),
  };
};
