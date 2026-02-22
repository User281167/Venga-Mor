"use client";

import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { useCallback, useMemo, useRef, useState } from "react";

import { FeedParams, FeedResponse, PostData } from "@/types/post";
import { feedKeys, fetchFeedPage } from "../fetchFeedPage";

interface UseFeedOptions extends FeedParams {
  enabled?: boolean;
}

export function useFeed({
  limit = 10,
  autorId,
  mediaType = "all",
  enabled = true,
}: UseFeedOptions = {}) {
  const queryClient = useQueryClient();
  const params: FeedParams = { limit, autorId, mediaType };

  // El seed actual para este conjunto de filtros
  // const [seedStart, setSeedStart] = useState(() => Math.random());
  const [seedStart, setSeedStart] = useState(0); // para tener todos los clips

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<
    FeedResponse,
    Error,
    InfiniteData<FeedResponse>,
    ReturnType<typeof feedKeys.list>,
    { cursor: string; seedStart: number } | undefined
  >({
    // El seed forma parte de la queryKey → si el seed cambia, TanStack
    // trata el resultado como una query distinta y hace un fetch nuevo.
    queryKey: feedKeys.list({ ...params, seedStart }),
    enabled,

    // Primera página: pageParam es undefined → API genera seedStart fresco
    queryFn: ({ pageParam }) =>
      fetchFeedPage({
        ...params,
        pageParam: pageParam ?? { cursor: "", seedStart },
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore || !lastPage.nextCursor) return undefined;

      return {
        cursor: lastPage.nextCursor,
        seedStart: lastPage.seedStart,
      };
    },
    initialPageParam: undefined,
    // Mantener datos previos mientras se carga la siguiente página
    placeholderData: (prev) => prev,
  });

  // ─── Posts aplanados ─────────────────────────────────────────────────────────
  // Todos los posts de todas las páginas en un solo array, sin duplicados.
  const posts = useMemo<PostData[]>(() => {
    if (!data?.pages) return [];

    const seen = new Set<string>();

    return data.pages.flatMap((page) =>
      page.posts.filter((post: PostData) => {
        if (seen.has(post.id)) return false;

        seen.add(post.id);
        return true;
      }),
    );
  }, [data?.pages]);

  // ─── Prefetch de la siguiente página ─────────────────────────────────────────
  const prefetchNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ─── Trigger por posición de scroll ──────────────────────────────────────────
  // Recibe el índice del post actualmente visible.
  // Dispara fetchNextPage cuando quedan THRESHOLD posts por ver.
  const PREFETCH_THRESHOLD = 3;
  const lastTriggerRef = useRef(-1);

  const onPostVisible = useCallback(
    (index: number) => {
      if (!hasNextPage || isFetchingNextPage) return;
      if (index === lastTriggerRef.current) return;

      const distanceFromEnd = posts.length - 1 - index;

      if (distanceFromEnd <= PREFETCH_THRESHOLD) {
        lastTriggerRef.current = index;
        fetchNextPage();
      }
    },
    [posts.length, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  // ─── Invalidar y refrescar ────────────────────────────────────────────────────
  // Limpia el cache del feed completo (útil al hacer pull-to-refresh).
  const refresh = useCallback(() => {
    lastTriggerRef.current = -1;
    setSeedStart(Math.random());
  }, []);

  // ─── Stats ────────────────────────────────────────────────────────────────────
  const totalLoaded = posts.length;
  const pagesLoaded = data?.pages.length ?? 0;

  return {
    // Datos
    posts,
    pagesLoaded,
    totalLoaded,

    // Estado de carga
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    error,

    // Paginación
    hasNextPage,
    fetchNextPage,
    prefetchNextPage,

    // Interacción
    onPostVisible,
    refresh,
    refetch,
  };
}
