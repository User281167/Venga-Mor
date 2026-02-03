// hooks/useFollow.ts
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
import { QueryResult } from "./queryResult";
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
        return QueryResult.businessError("ID de colaborador requerido");
      }

      const res = await getMyFollowStatus(colaboradorId);

      if (!res.success) {
        return QueryResult.businessError(
          res.message || "Error al verificar estado",
        );
      }

      if (!res.data) {
        return QueryResult.empty(); // No lo sigo
      }

      return QueryResult.success(res.data);
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
        return QueryResult.businessError("ID de colaborador requerido");
      }

      const res = await followCollaborator(colaboradorId);

      if (!res.success) {
        return QueryResult.businessError(res.message || "Error al seguir");
      }

      return QueryResult.success(undefined);
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
        QueryResult.success(tempFollow),
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
      if (result.status === "success") {
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
        return QueryResult.businessError("ID de colaborador requerido");
      }

      const res = await unfollowCollaborator(colaboradorId);

      if (!res.success) {
        return QueryResult.businessError(
          res.message || "Error al dejar de seguir",
        );
      }

      return QueryResult.success(undefined);
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
        QueryResult.empty(),
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
      if (result.status === "success") {
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

  const isFollowing = followStatus?.status === "success";
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
      const res = await getMyFollowing(pageParam);

      if (!res.success || !res.data) {
        return QueryResult.businessError(
          res.message || "Error al obtener seguidos",
        );
      }

      return QueryResult.success(res.data);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.status !== "success") return undefined;
      return lastPage.data.hasMore ? lastPage.data.lastId : undefined;
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
        return QueryResult.businessError("ID de colaborador requerido");
      }

      const res = await getCollaboratorFollowers(colaboradorId, pageParam);

      if (!res.success || !res.data) {
        return QueryResult.businessError(
          res.message || "Error al obtener seguidores",
        );
      }

      return QueryResult.success(res.data);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.status !== "success") return undefined;
      return lastPage.data.hasMore ? lastPage.data.lastId : undefined;
    },
    initialPageParam: null as string | null,
    enabled: !!colaboradorId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
}
