"use client";
import { useMyFollowing } from "@/hooks/useFollow";
import { Dialog, Button, Flex, Text, ScrollArea } from "@radix-ui/themes";
import { AlertCircle, Loader2, XIcon } from "lucide-react";
import { FollowingCard } from "./following-card";

interface FollowingListProps {
  loading: boolean;
}

export default function FollowingList({ loading }: FollowingListProps) {
  const {
    data,
    isLoading: useLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    refetch,
  } = useMyFollowing();

  // Extraer seguidos de todas las páginas
  const following = data?.pages.flatMap((page) => page?.data || []) || [];

  const total = data?.pages.reduce(
    (acc, page) => acc + (page?.data?.length || 0),
    0,
  );

  const isLoading = loading || useLoading || isFetching;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          Siguiendo {total !== null && `(${total})`}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="max-w-xl">
        <Dialog.Close className="absolute top-4 right-4 border-gray-400/30 border-2 rounded-md">
          <XIcon size={32} />
        </Dialog.Close>

        <Dialog.Title>
          <Flex align="center" gap="4">
            <Text as="p">Siguiendo</Text>

            {total !== null && (
              <Text size="2" color="gray">
                {total} {total === 1 ? "colaborador" : "colaboradores"}
              </Text>
            )}
          </Flex>
        </Dialog.Title>

        <Dialog.Description size="2" mb="4">
          Colaboradores que sigues
        </Dialog.Description>

        <ScrollArea style={{ maxHeight: "400px" }}>
          {/* Estado: Carga inicial */}
          {isLoading && (
            <Flex direction="column" gap="3" align="center" py="6">
              <Loader2 className="animate-spin" size={32} />

              <Text as="p" color="gray">
                Cargando seguidos...
              </Text>
            </Flex>
          )}

          {/* Estado: Error de red (throw en handler) */}
          {isError && !isLoading && (
            <Flex direction="column" gap="2" align="center" py="6">
              <AlertCircle size={32} color="red" />

              <Text as="p" color="red" weight="bold">
                Error al cargar
              </Text>

              <Text as="p" size="2" color="gray">
                {error.message}
              </Text>

              <Button size="2" variant="soft" onClick={() => refetch()}>
                Reintentar
              </Button>
            </Flex>
          )}

          {/* Estado: Sin seguidos */}
          {!isLoading && !isError && following.length === 0 && (
            <Flex direction="column" gap="2" align="center" py="6">
              <Text as="p" color="gray">
                No sigues a ningún colaborador aún
              </Text>
            </Flex>
          )}

          {/* Estado: Lista con datos */}
          {!isLoading && !isError && following.length > 0 && (
            <Flex direction="column" gap="2">
              {following.map((item) => (
                <FollowingCard key={item?.colaborador_id} user={item} />
              ))}

              {/* Botón "Cargar más" */}
              {hasNextPage && (
                <Flex justify="center" pt="3">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="soft"
                    className="w-full"
                  >
                    {isFetchingNextPage ? (
                      <Flex align="center" gap="2">
                        <Loader2 className="animate-spin" size={16} />
                        Cargando más...
                      </Flex>
                    ) : (
                      "Cargar más"
                    )}
                  </Button>
                </Flex>
              )}
            </Flex>
          )}
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  );
}
