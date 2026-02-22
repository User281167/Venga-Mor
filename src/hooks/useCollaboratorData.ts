import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCollaborator,
  updateCollaborator,
  getCollaborator,
} from "@/handlers/collaborator-handler";
import { CollaboratorInfo } from "@/schema/collaborator";
import { useUser } from "@/context/user-context";
import { BusinessError } from "@/errors/errors";
import { updateFirabaseIdToken } from "@/handlers/postIdToken";

// Hook para obtener datos del colaborador
export function useCollaboratorProfile() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["collaborator", user?.uid],
    queryFn: async () => {
      const result = await getCollaborator();

      if (!result.success || !result.data) {
        throw new BusinessError(
          result.message || "Error al obtener colaborador",
        );
      }

      return result.data;
    },
    enabled: !!user && user.tipo === "colaborador", // Solo si es colaborador
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 60,
    retry: 2,
  });
}

// Hook para crear colaborador
export function useCreateCollaborator() {
  const queryClient = useQueryClient();
  const { user, firebaseUser } = useUser();

  return useMutation({
    mutationFn: async (data: CollaboratorInfo) => {
      const result = await createCollaborator(data);

      if (!result.success || !result.data) {
        throw new BusinessError(result.message || "Error al crear colaborador");
      }

      return result.data;
    },
    onSuccess: async (data) => {
      // Guardar el colaborador en cache
      queryClient.setQueryData(["collaborator", user?.uid], data);

      // Actualizar el tipo de usuario en cache
      queryClient.setQueryData(
        ["user", "profile", firebaseUser?.uid],
        (old: any) => {
          if (!old) return old;
          return { ...old, tipo: "colaborador" };
        },
      );

      // Invalidar perfil público del colaborador
      if (user?.uid) {
        queryClient.invalidateQueries({
          queryKey: ["profile", user.uid],
        });
      }

      // forzar refresh del token + actualizar cookie
      try {
        if (!firebaseUser) {
          console.warn("No hay firebaseUser disponible");
          return;
        }

        // Force refresh → obtiene token con los claims nuevos
        const freshToken = await firebaseUser.getIdToken(
          /* forceRefresh */ true,
        );

        // Enviar al backend para actualizar la cookie http-only
        await updateFirabaseIdToken(freshToken);
      } catch (err) {
        throw new BusinessError(
          "Colaborador creado, pero hubo un error al actualizar la sesión. Por favor, cierra sesión y vuelve a iniciar sesión.",
        );
      }
    },
  });
}

// Hook para actualizar colaborador
export function useUpdateCollaborator() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (data: CollaboratorInfo) => {
      const result = await updateCollaborator(data);

      if (!result.success || !result.data) {
        throw new BusinessError(
          result.message || "Error al actualizar colaborador",
        );
      }

      return result.data;
    },
    onSuccess: (data) => {
      // Actualizar cache del colaborador
      queryClient.setQueryData(["collaborator", user?.uid], data);

      // Invalidar perfil público del colaborador
      // Actualiza el tipo de usuario en cache
      if (user?.uid) {
        queryClient.invalidateQueries({
          queryKey: ["profile", user.uid],
        });
      }
    },
  });
}
