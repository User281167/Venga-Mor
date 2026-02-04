"use client";
import { useMyFollowing } from "@/hooks/useFollow";
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
import Link from "next/link";
import { toast } from "sonner";

interface FollowingListProps {
  loading: boolean;
}

export default function FollowingList({ loading }: FollowingListProps) {
  const {
    data,
    isLoading: useLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useMyFollowing();

  // Extraer seguidos de todas las páginas
  const following =
    data?.pages.flatMap((page) => {
      if (page.status === "success") {
        return page.data.data;
      }
      return [];
    }) || [];

  // Obtener el total (de la primera página)
  const total =
    data?.pages[0]?.status === "success" ? data.pages[0].data.total : null;

  // Detectar errores de negocio en cualquier página
  const businessError = data?.pages.find(
    (page) => page.status === "business-error",
  );

  if (businessError) {
    toast.error(businessError.message);
  }

  const isLoading = loading || useLoading;

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
          <Flex justify="between" align="center">
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

          {/* Estado: Error de negocio (QueryResult.businessError) */}
          {!isLoading && businessError && (
            <Flex direction="column" gap="2" align="center" py="6">
              <AlertCircle size={32} color="orange" />

              <Text as="p" color="orange" weight="bold">
                {businessError.status === "business-error"
                  ? businessError.message
                  : "Error al obtener seguidos"}
              </Text>
            </Flex>
          )}

          {/* Estado: Sin seguidos */}
          {!isLoading &&
            !isError &&
            !businessError &&
            following.length === 0 && (
              <Flex direction="column" gap="2" align="center" py="6">
                <Text as="p" color="gray">
                  No sigues a ningún colaborador aún
                </Text>
              </Flex>
            )}

          {/* Estado: Lista con datos */}
          {!isLoading && !isError && !businessError && following.length > 0 && (
            <Flex direction="column" gap="2">
              {following.map((item) => (
                <Link
                  key={item.colaborador_id}
                  href={`/perfil-info/${item.colaborador_id}`}
                  className="block"
                >
                  <Flex
                    gap="3"
                    p="3"
                    align="center"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Avatar
                      src={item.avatar || undefined}
                      fallback={item.nombre.charAt(0)}
                      size="3"
                    />

                    <div className="flex-1">
                      <Heading as="h4" size="4" weight="bold">
                        {item.nombre}
                      </Heading>

                      <Text as="p" size="1" color="gray">
                        Siguiendo desde{" "}
                        {new Date(item.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </div>
                  </Flex>
                </Link>
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

              {/* Error al cargar siguiente página */}
              {!hasNextPage && isFetchingNextPage && (
                <Flex justify="center" pt="3">
                  <Text as="p" size="2" color="red">
                    Error al cargar más seguidos
                  </Text>
                </Flex>
              )}
            </Flex>
          )}
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  );
}
