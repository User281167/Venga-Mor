"use client";
import { useUser } from "@/context/user-context";
import { useComments, useMyComment, usePostComment } from "./comments.hook";
import { toast } from "sonner";
import { useState } from "react";
import {
  Button,
  Card,
  Flex,
  Heading,
  Spinner,
  Text,
  TextArea,
} from "@radix-ui/themes";

export default function Comments({
  collaboratorId,
}: {
  collaboratorId: string;
}) {
  const [newComment, setNewComment] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useComments(collaboratorId);
  const postMutation = usePostComment(collaboratorId);

  const { data: myComment, isLoading: loadingMyComment } =
    useMyComment(collaboratorId);

  let comments = data?.pages.flatMap((page) => page.data) ?? [];

  if (myComment) {
    comments = comments.filter(
      (comment) => comment.usuario_id !== myComment.usuario_id,
    );
    comments = [myComment, ...comments];
  }

  const { user } = useUser();

  const alredyCommented = comments.some(
    (comment) => comment.usuario_id === user?.uid,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Debes iniciar sesión para comentar");
      return;
    }

    if (!newComment.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    try {
      await postMutation.mutateAsync(newComment);
      setNewComment("");
      toast.success("Comentario publicado");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al publicar comentario",
      );
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Flex direction="column" gap="3">
      <Heading as="h2" size="4">
        Comentarios Públicos
      </Heading>

      <Flex direction="column" gap="3">
        {comments.map((comment, index) => (
          <Card key={index}>
            <Flex direction="column" gap="1">
              <Text as="p" weight="bold">
                {comment.usuario_id === user?.uid
                  ? "Tú"
                  : comment.usuario_nombre}
              </Text>

              <Text as="p" size="2" className="text-muted-foreground">
                {new Date(comment.fecha).toLocaleString()}
              </Text>

              <Text as="p" mt="2">
                {comment.contenido}
              </Text>
            </Flex>
          </Card>
        ))}

        {isError && (
          <Text as="p" color="red">
            {error.message}
          </Text>
        )}

        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isLoading || isFetchingNextPage}
            loading={isLoading || isFetchingNextPage}
          >
            Cargar más comentarios
          </Button>
        )}
      </Flex>

      <Flex direction="column" gap="2" mt="4" hidden={alredyCommented}>
        <TextArea
          placeholder="Escribe tu comentario público aquí..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={200}
          disabled={isLoading || loadingMyComment}
        />

        <Text className="text-gray-300/30">
          {newComment.length}/200 caracteres
        </Text>

        {isLoading && (
          <Text as="p" color="blue">
            Publicando comentario...
          </Text>
        )}

        <Button
          className="self-end"
          onClick={handleSubmit}
          disabled={isLoading}
          loading={isLoading || loadingMyComment}
        >
          Publicar Comentario
        </Button>
      </Flex>
    </Flex>
  );
}
