import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getProfiles } from "@/handlers/fetchProfileList";
import { getCollaborator } from "@/handlers/getPublicCollaborator";
import { Collaborator } from "@/types/collaborator";
import { LocationData } from "@/types/location-data";

// Hook para la lista con filtros y paginación
export function useProfilesList(
  ageRange: number[],
  categories: string[],
  star: number,
  locationData: LocationData,
) {
  return useInfiniteQuery({
    queryKey: [
      "public-profiles",
      "list",
      { ageRange, categories, star, locationData },
    ],
    queryFn: async ({ pageParam }) => {
      const result = await getProfiles(
        ageRange[0],
        ageRange[1],
        categories,
        locationData,
        star,
        pageParam,
      );

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastId : undefined;
    },
    initialPageParam: null as string | null,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

// Hook para un perfil individual
export function useProfile(id: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["profile-info", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Profile not found");
      }

      const res = await getCollaborator(id);

      if (!res.success || !res.data) {
        throw new Error("Profile not found");
      }

      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    // Intenta encontrar el perfil en las listas cacheadas
    initialData: () => {
      if (!id) return undefined;

      // Busca en todas las queries de listas
      const queries = queryClient.getQueriesData<{
        pages: Array<{ data: Collaborator[] }>;
      }>({
        queryKey: ["public-profiles", "list"],
      });

      for (const [, data] of queries) {
        if (!data?.pages) continue;

        for (const page of data.pages) {
          const profile = page.data.find((p) => p.uid === id);

          if (profile) return profile;
        }
      }

      return undefined;
    },
  });
}
