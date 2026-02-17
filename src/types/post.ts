export interface MediaFile {
  url: string;
  path: string;
  name: string;
}

export interface PostData {
  id: string;
  autorId: string;
  descripcion: string;
  media: {
    images: MediaFile[];
    video: MediaFile | null;
  };
  creado: string;
  actualizado: string;
  randomSeed: number;
}

export interface FeedResponse {
  posts: PostData[];
  nextCursor: string | null;
  hasMore: boolean;
  seedStart: number;
  metadata: {
    totalReturned: number;
    requestedLimit: number;
    hasVideo: number;
    hasImages: number;
  };
}

export type MediaTypeFilter = "all" | "video" | "images";

export interface FeedParams {
  limit?: number;
  autorId?: string;
  mediaType?: MediaTypeFilter;
  seedStart?: number;
}
