"use client";
import { useCollaboratorFollowers } from "@/hooks/useFollow";
import {
  Dialog,
  Button,
  Flex,
  Avatar,
  Text,
  ScrollArea,
  Heading,
} from "@radix-ui/themes";
import { AlertCircle, Loader2, XIcon } from "lucide-react";

interface FollowersListProps {
  colaboradorId: string;
}

export default function FollowersList({ colaboradorId }: FollowersListProps) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useCollaboratorFollowers(colaboradorId);

  const followers = data?.pages.flatMap((p) => p?.data || []) || [];
  const total = data?.pages.reduce((acc, page) => acc + (page?.total || 0), 0);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          Seguidores {total !== null && `(${total})`}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="max-w-xl">
        <Dialog.Close className="absolute top-4 right-4 border-gray-400/30 border-2 rounded-md">
          <XIcon size={32} />
        </Dialog.Close>

        <Dialog.Title>
          <Flex gap="4" align="center">
            <Heading as="h2">Seguidores</Heading>

            {total !== null && (
              <Text size="2" color="gray">
                {total} {total === 1 ? "seguidor" : "seguidores"}
              </Text>
            )}
          </Flex>
        </Dialog.Title>

        <Dialog.Description size="2" mb="4">
          Personas que siguen a este colaborador
        </Dialog.Description>

        <ScrollArea style={{ maxHeight: "400px" }}>
          {isLoading && (
            <Flex direction="column" gap="3" align="center" py="6">
              <Loader2 className="animate-spin" size={32} />

              <Text as="p" color="gray">
                Cargando seguidores...
              </Text>
            </Flex>
          )}

          {isError && !isLoading && (
            <Flex direction="column" gap="2" align="center" py="6">
              <AlertCircle size={32} color="red" />

              <Text as="p" color="red" weight="bold">
                Error al cargar
              </Text>

              <Text as="p" size="2" color="gray">
                {error instanceof Error ? error.message : "Error de conexión"}
              </Text>

              <Button
                size="2"
                variant="soft"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </Button>
            </Flex>
          )}

          {!isLoading && isError && (
            <Flex direction="column" gap="2" align="center" py="6">
              <AlertCircle size={32} color="orange" />

              <Text as="p" color="orange" weight="bold">
                {!!error ? error.message : "Error al obtener seguidores"}
              </Text>
            </Flex>
          )}

          {!isLoading && !isError && followers.length === 0 && (
            <Flex direction="column" gap="2" align="center" py="6">
              <Text as="p" color="gray">
                Aún no tiene seguidores
              </Text>
            </Flex>
          )}

          {!isLoading && !isError && followers.length > 0 && (
            <Flex direction="column" gap="2">
              {followers.map((follower) => (
                <Flex
                  key={follower?.usuario_id}
                  gap="3"
                  p="3"
                  align="center"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Avatar
                    src={follower?.avatar || undefined}
                    fallback={follower?.nombre?.charAt(0)}
                    size="3"
                  />

                  <div className="flex-1">
                    <Heading as="h4" size="4" weight="bold">
                      {follower?.nombre}
                    </Heading>

                    <Text as="p" size="1" color="gray">
                      Siguiendo desde{" "}
                      {new Date(follower?.fecha || "").toLocaleDateString(
                        "es-ES",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </Text>
                  </div>
                </Flex>
              ))}

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
