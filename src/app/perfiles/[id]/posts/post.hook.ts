import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPublicPosts } from "./fetchPublicPosts";
import { PostData } from "@/types/post";

export const usePublicPostsFeed = (collaboratorId: string) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [lastId, setLastId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasLoadedRef = useRef(false);

  const loadPosts = useCallback(
    async (isFirstLoad: boolean = false) => {
      if (isLoading || (!hasMore && !isFirstLoad) || !collaboratorId) return;

      setIsLoading(true);
      setError(null);

      const currentLastId = isFirstLoad ? null : lastId;
      const result = await fetchPublicPosts(collaboratorId, currentLastId);

      if (result.success && result.data) {
        const data = result.data;

        const newPosts = isFirstLoad ? data.data : [...posts, ...data.data];
        setPosts(newPosts);
        setLastId(data.lastId);
        setHasMore(data.hasMore);
      } else {
        setError(result.message);
      }

      setIsLoading(false);
    },
    [collaboratorId, lastId, hasMore, isLoading],
  );

  // carga inicial segura
  useEffect(() => {
    if (!collaboratorId) return;
    if (hasLoadedRef.current) return;

    hasLoadedRef.current = true;
    loadPosts(true);
  }, [collaboratorId, loadPosts]);

  return {
    posts,
    isLoading,
    hasMore,
    error,
    loadMore: () => loadPosts(false),
    refresh: () => {
      hasLoadedRef.current = false;
      setPosts([]);
      setLastId(null);
      setHasMore(true);
      loadPosts(true);
    },
  };
};
