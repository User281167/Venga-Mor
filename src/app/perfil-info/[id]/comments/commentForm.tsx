"use client";
import { usePostComment } from "./comments.hook";
import React, { useState } from "react";

import { Button, Flex, Spinner, Text, TextArea } from "@radix-ui/themes";
import { toast } from "sonner";

interface CommentFormProps {
  collaboratorId: string;
}

export function CommentForm({ collaboratorId }: CommentFormProps) {
  const [newComment, setNewComment] = useState("");
  const postMutation = usePostComment(collaboratorId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    await postMutation.mutateAsync(newComment);
    setNewComment("");
  };

  if (postMutation.isPending) return <Spinner size="2" className="mx-auto" />;

  return (
    <Flex direction="column" gap="2" mt="4">
      <TextArea
        placeholder="Escribe tu comentario público aquí..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        maxLength={200}
        disabled={postMutation.isPending}
        hidden={postMutation.isPending}
      />

      <Text className="text-gray-300/30">
        {newComment.length}/200 caracteres
      </Text>

      <Button
        className="self-end"
        onClick={handleSubmit}
        disabled={postMutation.isPending}
        loading={postMutation.isPending}
      >
        Publicar Comentario
      </Button>
    </Flex>
  );
}
