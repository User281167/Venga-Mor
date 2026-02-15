"use client";

import { Button, Flex, Heading, Spinner, Text } from "@radix-ui/themes";
import { Star, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  useDeleteRaiting,
  useRaitingCollaborator,
  useSendRaiting,
} from "./raiting.hook";
import { toast } from "sonner";
import { useUser } from "@/context/user-context";

interface RaitingCollaboratorProps {
  collaboratorId: string;
}

export default function RaitingCollaborator({
  collaboratorId,
}: RaitingCollaboratorProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const { data, isFetching, isError, error } =
    useRaitingCollaborator(collaboratorId);

  const send = useSendRaiting();
  const deleteRaiting = useDeleteRaiting();
  const { user } = useUser();

  useEffect(() => {
    if (send.isError && send.error) {
      toast.error(`Error al enviar la calificación: ${send.error.message}`);
    }
  }, [send.isError, send.error]);

  useEffect(() => {
    if (deleteRaiting.isError && deleteRaiting.error) {
      toast.error(
        `Error al eliminar la calificación: ${deleteRaiting.error.message}`,
      );
    }
  }, [deleteRaiting.isError, deleteRaiting.error]);

  const handleRating = useCallback(
    (value: number) => {
      if (isFetching || send.isPending) return;
      if (value < 1 || value > 5) return;
      if (data && data.valor === value) return; // evitar reenvío de la misma calificación

      send.mutate({ collaboratorId, value });
      setHoverRating(0);
    },
    [collaboratorId, data, isFetching, send, setHoverRating],
  );

  const handleDeleteRating = useCallback(() => {
    if (isFetching || deleteRaiting.isPending) return;
    if (!data) return; // no hay calificación que eliminar

    deleteRaiting.mutate({ collaboratorId });
    setHoverRating(0);
  }, [collaboratorId, data, isFetching, deleteRaiting, setHoverRating]);

  if (user?.uid === collaboratorId) {
    return null;
  }

  if (isError) {
    return (
      <Text as="p">
        Error al cargar la calificación:{" "}
        <Text color="red">{error.message}</Text>
      </Text>
    );
  }

  const raiting = hoverRating || data?.valor || 0;
  const isLoading = isFetching || send.isPending;
  const starColor = isLoading
    ? "text-gray-500 fill-gray-400 cursor-not-allowed"
    : "text-yellow-400 fill-yellow-500";

  return (
    <Flex direction="column" gap="2">
      <Heading as="h2" size="4">
        Calificación
      </Heading>

      <Flex align="center" gap="4">
        <Flex>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${
                raiting >= star ? starColor : "text-gray-500"
              }`}
              onClick={() => handleRating(star)}
              onMouseEnter={() => {
                if (!isLoading) setHoverRating(star);
              }}
              onMouseLeave={() => {
                if (!isLoading) setHoverRating(0);
              }}
            />
          ))}
        </Flex>

        {isLoading && <Spinner size="2" />}

        {!isLoading && (
          <Text as="p" weight="bold">
            ({raiting} de 5)
          </Text>
        )}

        {!isLoading && data?.valor && (
          <Button
            variant="ghost"
            size="1"
            color="red"
            className="cursor-pointer"
            onClick={() => handleDeleteRating()}
          >
            <Trash color="red" />
          </Button>
        )}
      </Flex>

      {!data?.valor && !isLoading && (
        <Text as="p" size="2" className="text-muted-foreground">
          Deja tu calificación para ayudar a otros.
        </Text>
      )}
    </Flex>
  );
}
