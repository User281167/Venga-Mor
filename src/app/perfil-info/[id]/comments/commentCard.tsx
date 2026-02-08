"use client";
import React from "react";
import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { CommentModel } from "@/types/comment";
import { Trash } from "lucide-react";

interface CommentCardProps {
  comment: CommentModel;
  owner: boolean;
  handleDelete?: () => void;
}

export const CommentCard = React.memo(function CommentCard({
  comment,
  owner = false,
  handleDelete,
}: CommentCardProps) {
  return (
    <Card className="flex flex-col gap2">
      <Flex align="center" justify="between">
        <Text as="p" weight="bold">
          {owner ? "Tú" : comment.usuario_nombre}
        </Text>

        {owner && (
          <Button
            className="bg-transparent p-0 cursor-pointer hover:scale-105"
            onClick={handleDelete}
          >
            <Trash color="red" />
          </Button>
        )}
      </Flex>

      <Text as="p" size="2" className="text-muted-foreground">
        {new Date(comment.fecha).toLocaleString()}
      </Text>

      <Text as="p" mt="2">
        {comment.contenido}
      </Text>
    </Card>
  );
});
