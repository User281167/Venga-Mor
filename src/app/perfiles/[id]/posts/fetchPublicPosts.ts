import { PostListDto } from "@/dtos/post.dto";
import { ApiResponse } from "@/lib/api-response";

export const fetchPublicPosts = async (
  collaboratorId: string,
  lastId: string | null,
): Promise<ApiResponse<PostListDto>> => {
  const params = new URLSearchParams();

  if (lastId) {
    params.append("lastId", lastId);
  }

  try {
    const response = await fetch(
      `/api/colaboradores/${collaboratorId}/posts?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store", // importante para feeds
      },
    );

    const json = await response.json();
    console.log("Fetched posts:", json as ApiResponse<PostListDto>);

    return json as ApiResponse<PostListDto>;
  } catch {
    return ApiResponse.failure("Error al cargar posts");
  }
};
