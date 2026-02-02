import { CommentModel } from "@/types/comment";

export type CommentsDto = {
  data: CommentModel[];
  lastId: string | null;
  total: number;
  hasMore: boolean;
};
