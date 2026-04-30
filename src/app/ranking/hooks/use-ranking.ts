"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

import { getRankingCollaborators } from "@/handlers/getRankingCollaborators";

export function useRankingCollaborators() {
  const query = useInfiniteQuery({
    queryKey: ["ranking-collaborators"],
    queryFn: async ({ pageParam }) => {
      const result = await getRankingCollaborators(pageParam ?? null);

      if (!result.success || !result.data) {
        throw new Error(result.message || "Error al cargar ranking");
      }

      return result.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastId : undefined;
    },
    initialPageParam: null as string | null,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(query.error.message);
    }
  }, [query.error, query.isError]);

  return query;
}
