import { PostData } from "@/types/post";

export type PostListDto = {
  data: PostData[];
  lastId: string | null;
  total: number;
  hasMore: boolean;
};
