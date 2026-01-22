import { PostListDto } from "@/dtos/post.dto";
import { ApiResponse } from "@/lib/api-response";

export const fetchPosts = async (
  lastId?: string | null,
): Promise<ApiResponse<PostListDto>> => {
  const url = new URL("/api/usuarios/posts", window.location.origin);

  if (lastId) {
    url.searchParams.append("lastId", lastId);
  }

  try {
    const response = await fetch(url.toString());
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Error al cargar posts");
    }

    // Retornamos el payload que viene dentro de tu ApiResponse.success
    return ApiResponse.success(json.data as PostListDto);
  } catch (error) {
    return ApiResponse.failure("Error al cargar posts");
  }
};
