import { BusinessError } from "@/errors/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getMyRaiting from "./getMyRaiting";
import { ApiResponse } from "@/lib/api-response";
import { Raiting } from "@/app/models/raiting.model";

// Obtener Mi calificación actual del colaborador
export function useRaitingCollaborator(collaboratorId?: string) {
  return useQuery({
    queryKey: ["collaboratorRaiting", collaboratorId],
    queryFn: async () => {
      if (!collaboratorId || !collaboratorId.trim()) {
        throw new BusinessError("Error colaborador no encontrado");
      }
      return await getMyRaiting(collaboratorId);
    },
    enabled: !!collaboratorId,
    initialData: null,
  });
}

export function useSendRaiting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collaboratorId,
      value,
    }: {
      collaboratorId: string;
      value: number;
    }) => {
      if (!collaboratorId || !collaboratorId.trim()) {
        throw new BusinessError("Error colaborador no encontrado");
      } else if (value < 1 || value > 5) {
        throw new BusinessError("El valor debe estar entre 1 y 5");
      }

      const response = await fetch(`/api/me/raiting/${collaboratorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor: value }),
        credentials: "same-origin",
      });

      const json = (await response.json()) as ApiResponse<Raiting>;

      if (!response.ok || !json.success) {
        throw new BusinessError(
          json.message || "Error al enviar calificación",
        );
      }

      return json.data;
    },
    onMutate: async ({ collaboratorId, value }) => {
      await queryClient.cancelQueries({
        queryKey: ["collaboratorRaiting", collaboratorId],
      });

      const previousRaiting = queryClient.getQueryData<Raiting | null>([
        "collaboratorRaiting",
        collaboratorId,
      ]);

      // optimistic value
      queryClient.setQueryData(
        ["collaboratorRaiting", collaboratorId],
        (old: Raiting | null) =>
          old
            ? { ...old, valor: value }
            : ({
                id: "optimistic",
                colaboradorId: collaboratorId,
                valor: value,
              } as Raiting),
      );

      return { previousRaiting };
    },
    onError: (error, { collaboratorId }, context) => {
      if (context?.previousRaiting !== undefined) {
        queryClient.setQueryData(
          ["collaboratorRaiting", collaboratorId],
          context.previousRaiting,
        );
      }
    },
    onSuccess: (data, { collaboratorId }) => {
      queryClient.setQueryData(["collaboratorRaiting", collaboratorId], data);
    },
  });
}

export function useDeleteRaiting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collaboratorId }: { collaboratorId: string }) => {
      if (!collaboratorId || !collaboratorId.trim()) {
        throw new BusinessError("Error colaborador no encontrado");
      }

      const response = await fetch(`/api/me/raiting/${collaboratorId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (!response.ok) {
        const json = await response.json();
        throw new BusinessError(
          json.message || "Error al eliminar calificación",
        );
      }
    },
    onMutate: async ({ collaboratorId }) => {
      await queryClient.cancelQueries({
        queryKey: ["collaboratorRaiting", collaboratorId],
      });

      const previousRaiting = queryClient.getQueryData([
        "collaboratorRaiting",
        collaboratorId,
      ]);

      queryClient.setQueryData(["collaboratorRaiting", collaboratorId], null);

      return { previousRaiting };
    },
    onError: (error, { collaboratorId }, context) => {
      if (context?.previousRaiting) {
        queryClient.setQueryData(
          ["collaboratorRaiting", collaboratorId],
          context.previousRaiting,
        );
      }
    },
    onSuccess: (_, { collaboratorId }) => {
      queryClient.invalidateQueries({
        queryKey: ["collaboratorRaiting", collaboratorId],
      });
    },
  });
}
