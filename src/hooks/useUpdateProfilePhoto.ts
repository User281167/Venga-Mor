import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/user-context";
import { AppUser } from "@/types/user";
import { updateImage } from "@/handlers/updateUser";
import { BusinessError } from "@/errors/errors";

export function useUpdateProfilePhoto() {
  const queryClient = useQueryClient();
  const { firebaseUser } = useUser();

  return useMutation({
    mutationFn: async (file: File) => {
      const result = await updateImage(file);

      if (!result.success || !result.data) {
        throw new BusinessError(result.message || "Error al actualizar imagen");
      }

      // Retorna solo la nueva URL
      return result.data;
    },
    onSuccess: (newPhotoUrl: string) => {
      // Actualiza solo el campo foto en la cache existente
      queryClient.setQueryData(
        ["user", "profile", firebaseUser?.uid],
        (old: AppUser | undefined) => {
          if (!old) return old;
          return { ...old, foto: newPhotoUrl };
        },
      );

      // Si es colaborador, invalida su perfil público
      if (firebaseUser?.uid) {
        queryClient.invalidateQueries({
          queryKey: ["profile", firebaseUser.uid],
        });
      }
    },
  });
}
