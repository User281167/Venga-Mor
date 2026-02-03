"use client";
import { useUser } from "@/context/user-context";
import {
  useComments,
  useDeleteMyComment,
  useMyComment,
  usePostComment,
} from "./comments.hook";
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
import { CommentModel } from "@/types/comment";
import { Trash } from "lucide-react";

function CommentCard({
  comment,
  owner = false,
  handleDelete,
}: {
  comment: CommentModel;
  owner?: boolean;
  handleDelete?: () => void;
}) {
  return (
    <Card className="flex flex-col gap2">
      <Flex align="center" justify="between">
        <Text as="p" weight="bold">
          {owner ? "Tú" : comment.usuario_nombre}
        </Text>

        <Button
          className="bg-transparent p-0 cursor-pointer hover:bg-red-300 transition-colors"
          onClick={handleDelete}
        >
          <Trash color="red" />
        </Button>
      </Flex>

      <Text as="p" size="2" className="text-muted-foreground">
        {new Date(comment.fecha).toLocaleString()}
      </Text>

      <Text as="p" mt="2">
        {comment.contenido}
      </Text>
    </Card>
  );
}

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
  const deleteMutation = useDeleteMyComment(collaboratorId);

  const { data: myComment, isLoading: loadingMyComment } =
    useMyComment(collaboratorId);

  const { user } = useUser();

  let comments = data?.pages.flatMap((page) => page.data) ?? [];

  if (myComment) {
    comments = comments.filter(
      (comment) => comment.usuario_id !== myComment.usuario_id,
    );
  }

  const alredyCommented = !!myComment;

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

  const handleDelete = async () => {
    const result = await deleteMutation.mutateAsync();

    // Manejar diferentes estados del resultado
    if (result.status === "success") {
      toast.success("Comentario eliminado correctamente");
    } else if (result.status === "business-error") {
      toast.error(result.message);
    } else if (result.status === "empty") {
      toast.info("No se encontró el comentario");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (comments.length === 0) {
    return (
      <Heading as="h2" size="4">
        No hay comentarios publicos
      </Heading>
    );
  }

  return (
    <Flex direction="column" gap="3">
      <Heading as="h2" size="4">
        Comentarios Públicos
      </Heading>

      <Flex direction="column" gap="3">
        {myComment && (
          <CommentCard
            key={myComment.id}
            comment={myComment}
            handleDelete={handleDelete}
          />
        )}

        {comments.map((comment, index) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}

        {isError && (
          <Text as="p" color="red">
            {error.message}
          </Text>
        )}

        {hasNextPage && (
          <Button
            className="w-fit mx-auto"
            onClick={() => fetchNextPage()}
            disabled={isLoading || isFetchingNextPage}
            loading={isLoading || isFetchingNextPage}
          >
            Cargar más comentarios
          </Button>
        )}
      </Flex>

      <Flex
        direction="column"
        gap="2"
        mt="4"
        hidden={alredyCommented || collaboratorId === user?.uid}
      >
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
