import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppUser } from "@/types/user";
import { useUser } from "@/context/user-context";
import { updateUser } from "@/handlers/updateUser";
import { UpdateUserInfo } from "@/dtos/user.dto";
import { BusinessError } from "@/errors/errors";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { firebaseUser } = useUser();

  return useMutation({
    mutationFn: async (updatedData: UpdateUserInfo) => {
      const result = await updateUser(updatedData);

      if (!result.success || !result.data) {
        throw new BusinessError(
          result.message || "Error al actualizar usuario",
        );
      }

      return result.data;
    },
    onSuccess: (updatedUser: AppUser) => {
      // Actualizar cache del perfil de usuario
      queryClient.setQueryData(
        ["user", "profile", firebaseUser?.uid],
        updatedUser,
      );

      // Si el usuario es colaborador, también invalidar su perfil público
      if (updatedUser.tipo === "colaborador") {
        queryClient.invalidateQueries({
          queryKey: ["profile", updatedUser.uid],
        });
      }
    },
    onError: (error) => {
      console.error("Error en mutación de actualización:", error);
    },
  });
}
