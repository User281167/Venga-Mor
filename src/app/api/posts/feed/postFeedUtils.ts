// ==================== UTILIDADES ====================

import { PostData } from "@/types/post";
import { FEED_CONFIG } from "./postFeedConstants";

export function serializePost(doc: any): PostData {
  const data = doc.data();

  return {
    id: doc.id,
    actualizado: data.actualizado ?? new Date().toISOString(),
    autorId: data.autorId,
    creado: data.creado ?? new Date().toISOString(),
    descripcion: data.descripcion,
    media: data.media,
    randomSeed: data.randomSeed,
    autorNombre: data.autorNombre ?? "",
  };
}

export function validateQueryParams(params: URLSearchParams): {
  valid: boolean;
  error?: string;
  data?: {
    limit: number;
    cursor: string | null;
    seedStart: number;
    autorId: string | null;
    mediaType: "all" | "video" | "images" | null;
  };
} {
  // Validar limit
  const limitStr = params.get("limit");
  const limit = limitStr ? parseInt(limitStr) : FEED_CONFIG.DEFAULT_LIMIT;

  if (isNaN(limit)) {
    return { valid: false, error: "Limit debe ser un número" };
  }

  if (limit < FEED_CONFIG.MIN_LIMIT || limit > FEED_CONFIG.MAX_LIMIT) {
    return {
      valid: false,
      error: `Limit debe estar entre ${FEED_CONFIG.MIN_LIMIT} y ${FEED_CONFIG.MAX_LIMIT}`,
    };
  }

  // Validar seedStart
  const seedStartStr = params.get("seedStart");
  let seedStart: number;

  if (seedStartStr) {
    seedStart = parseFloat(seedStartStr);
    if (isNaN(seedStart) || seedStart < 0 || seedStart > 1) {
      return { valid: false, error: "seedStart debe estar entre 0 y 1" };
    }
  } else {
    seedStart = Math.random();
  }

  // Validar cursor
  const cursor = params.get("cursor");
  if (cursor) {
    const cursorValue = parseFloat(cursor);
    if (isNaN(cursorValue)) {
      return { valid: false, error: "cursor inválido" };
    }
  }

  // Validar mediaType
  const mediaType = params.get("mediaType") as
    | "all"
    | "video"
    | "images"
    | null;
  if (mediaType && !["all", "video", "images"].includes(mediaType)) {
    return { valid: false, error: "mediaType debe ser: all, video, o images" };
  }

  return {
    valid: true,
    data: {
      limit,
      cursor,
      seedStart,
      autorId: params.get("autorId"),
      mediaType,
    },
  };
}
