export type PaginationDto<T> = {
  data: T[];
  lastId: string | null;
  total: number | null;
  hasMore: boolean;
};
