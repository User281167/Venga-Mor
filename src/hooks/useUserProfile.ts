import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/handlers/getUserProfile";
import { BusinessError } from "@/errors/errors";
import { AppUser } from "@/types/user";

export function useUserProfile(firebaseUid: string | null) {
  return useQuery({
    queryKey: ["user", "profile", firebaseUid],
    queryFn: async () => {
      const res = await getUserProfile();

      if (!res.success || !res.data) {
        throw new BusinessError(res.message || "Error al obtener usuario");
      }

      return res.data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!firebaseUid, // Solo ejecuta si hay Firebase user
    staleTime: 1000 * 60 * 60, // el perfil no cambia tan seguido
    gcTime: 1000 * 60 * 60,
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

export function useUpdateLocalUser() {
  const queryClient = useQueryClient();

  return (user: AppUser) => {
    queryClient.setQueryData(["user", "profile", user.uid], user);
  };
}
