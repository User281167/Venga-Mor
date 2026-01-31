import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/handlers/getUserProfile";

export function useUserProfile(firebaseUid: string | null) {
  return useQuery({
    queryKey: ["user", "profile", firebaseUid],
    queryFn: async () => {
      const res = await getUserProfile();

      if (!res.success || !res.data) {
        throw new Error(res.message || "Error al obtener usuario");
      }

      return res.data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!firebaseUid, // Solo ejecuta si hay Firebase user
    staleTime: 1000 * 60 * 5, // 5 minutos - el perfil no cambia tan seguido
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
  });
}

export function useInvalidateUserProfile() {
  const queryClient = useQueryClient();

  return (firebaseUid: string | null) => {
    queryClient.invalidateQueries({
      queryKey: ["user", "profile", firebaseUid],
    });
  };
}
