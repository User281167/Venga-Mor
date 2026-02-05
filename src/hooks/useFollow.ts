import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getMyFollowStatus,
  followCollaborator,
  unfollowCollaborator,
  getMyFollowing,
  getCollaboratorFollowers,
} from "@/handlers/follow-handler";
import { useUser } from "@/context/user-context";
import { FollowingModel } from "@/app/models/follow.model";

// ============================================
// 1. Hook para verificar si sigo a un colaborador
// ============================================
export function useFollowStatus(colaboradorId: string | undefined) {
  const { user } = useUser();

  return useQuery({
    queryKey: ["followStatus", colaboradorId, user?.uid],
    queryFn: async () => {
      if (!colaboradorId) {
        return false;
      }

      const res = await getMyFollowStatus(colaboradorId);
      return res.success;
    },
    enabled: !!colaboradorId && !!user, // Solo si hay colaborador y usuario autenticado
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// ============================================
// 2. Hook para seguir a un colaborador
// ============================================
export function useFollowCollaborator(colaboradorId: string | undefined) {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async () => {
      if (!colaboradorId) {
        return false;
      }

      const res = await followCollaborator(colaboradorId);
      return res.success; // follow retorna undefined, retornar true para verficar onSuccess
    },
    onMutate: async () => {
      // Actualización optimista
      await queryClient.cancelQueries({
        queryKey: ["followStatus", colaboradorId, user?.uid],
      });

      const previous = queryClient.getQueryData([
        "followStatus",
        colaboradorId,
        user?.uid,
      ]);

      // Crear un follow temporal
      const tempFollow: FollowingModel = {
        colaborador_id: colaboradorId!,
        fecha: new Date().toISOString(),
        nombre: "", // Se actualizará con los datos reales
        avatar: "",
      };

      queryClient.setQueryData(
        ["followStatus", colaboradorId, user?.uid],
        tempFollow,
      );

      return { previous };
    },
    onError: (error, variables, context) => {
      // Rollback
      if (context?.previous) {
        queryClient.setQueryData(
          ["followStatus", colaboradorId, user?.uid],
          context.previous,
        );
      }
    },
    onSuccess: (result) => {
      if (result) {
        // Invalidar para refrescar con datos reales
        queryClient.invalidateQueries({
          queryKey: ["followStatus", colaboradorId, user?.uid],
        });

        // Invalidar lista de seguidos
        queryClient.invalidateQueries({
          queryKey: ["myFollowing"],
        });

        // Invalidar contador de seguidores del colaborador
        queryClient.invalidateQueries({
          queryKey: ["collaboratorFollowers", colaboradorId],
        });
      }
    },
  });
}

// ============================================
// 3. Hook para dejar de seguir a un colaborador
// ============================================
export function useUnfollowCollaborator(colaboradorId: string | undefined) {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async () => {
      if (!colaboradorId) {
        return false;
      }

      const res = await unfollowCollaborator(colaboradorId);
      return res.success;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["followStatus", colaboradorId, user?.uid],
      });

      const previous = queryClient.getQueryData([
        "followStatus",
        colaboradorId,
        user?.uid,
      ]);

      // Remover el follow optimísticamente
      queryClient.setQueryData(
        ["followStatus", colaboradorId, user?.uid],
        false,
      );

      return { previous };
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["followStatus", colaboradorId, user?.uid],
          context.previous,
        );
      }
    },
    onSuccess: (result) => {
      if (result) {
        queryClient.invalidateQueries({
          queryKey: ["followStatus", colaboradorId, user?.uid],
        });

        queryClient.invalidateQueries({
          queryKey: ["myFollowing"],
        });

        queryClient.invalidateQueries({
          queryKey: ["collaboratorFollowers", colaboradorId],
        });
      }
    },
  });
}

// ============================================
// 4. Hook combinado para toggle follow/unfollow
// ============================================
export function useToggleFollow(colaboradorId: string | undefined) {
  const followMutation = useFollowCollaborator(colaboradorId);
  const unfollowMutation = useUnfollowCollaborator(colaboradorId);
  const { data: followStatus } = useFollowStatus(colaboradorId);

  const isFollowing = !!followStatus;
  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const toggle = async () => {
    if (isFollowing) {
      return await unfollowMutation.mutateAsync();
    } else {
      return await followMutation.mutateAsync();
    }
  };

  return {
    toggle,
    isFollowing,
    isPending,
    followStatus,
  };
}

// ============================================
// 5. Hook para obtener mis seguidos (paginación infinita)
// ============================================
export function useMyFollowing() {
  const { user } = useUser();

  return useInfiniteQuery({
    queryKey: ["myFollowing", user?.uid],
    queryFn: async ({ pageParam }) => {
      if (!user) {
        return undefined;
      }

      const res = await getMyFollowing(pageParam);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.hasMore ? lastPage.lastId : undefined;
    },
    initialPageParam: null as string | null,
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
}

// ============================================
// 6. Hook para obtener seguidores de un colaborador (paginación infinita)
// ============================================
export function useCollaboratorFollowers(colaboradorId: string | undefined) {
  return useInfiniteQuery({
    queryKey: ["collaboratorFollowers", colaboradorId],
    queryFn: async ({ pageParam }) => {
      if (!colaboradorId) {
        return undefined;
      }

      const res = await getCollaboratorFollowers(colaboradorId, pageParam);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.hasMore ? lastPage.lastId : undefined;
    },
    initialPageParam: null as string | null,
    enabled: !!colaboradorId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
}
