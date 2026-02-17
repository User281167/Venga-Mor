// ─── Query Keys ────────────────────────────────────────────────────────────────
// Tipados y centralizados: facilita invalidación granular y previene typos.

import { BusinessError } from "@/errors/errors";
import { api } from "@/lib/apiHelper";
import { FeedParams, FeedResponse } from "@/types/post";

export const feedKeys = {
  all: ["feed"] as const,
  lists: () => [...feedKeys.all, "list"] as const,
  list: (params: FeedParams) => [...feedKeys.lists(), params] as const,
};

interface FetchFeedParams extends FeedParams {
  pageParam?: {
    cursor: string;
    seedStart: number;
  };
}

export async function fetchFeedPage(
  params: FetchFeedParams,
): Promise<FeedResponse> {
  const url = new URL("/api/posts/feed", window.location.origin);

  // Paginación
  if (params.pageParam?.cursor) {
    url.searchParams.set("cursor", params.pageParam.cursor);
  }
  if (params.pageParam?.seedStart !== undefined) {
    url.searchParams.set("seedStart", params.pageParam.seedStart.toString());
  }

  // Filtros opcionales
  if (params.limit) {
    url.searchParams.set("limit", params.limit.toString());
  }
  if (params.autorId) {
    url.searchParams.set("autorId", params.autorId);
  }
  if (params.mediaType && params.mediaType !== "all") {
    url.searchParams.set("mediaType", params.mediaType);
  }

  const res = await api.get<FeedResponse>(url.toString(), {
    // Next.js fetch: cachea en el Data Cache del server
    // En cliente, usa el cache del browser
    next: { revalidate: 120 }, // 2 min
  });

  if (!res.success || !res.data) {
    throw new BusinessError(res.message || "Error obteniendo los posts");
  }

  return res.data;
}
