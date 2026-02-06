"use client";
import { useUser } from "@/context/user-context";
import { useComments, useDeleteMyComment, useMyComment } from "./comments.hook";
import React, { useCallback, useMemo } from "react";
import { Box, Button, Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import { CommentCard } from "./commentCard";
import { CommentForm } from "./commentForm";

export default function Comments({
  collaboratorId,
}: {
  collaboratorId: string;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    error,
    isError,
  } = useComments(collaboratorId);

  const deleteMutation = useDeleteMyComment(collaboratorId);

  const { data: myComment, isLoading: loadingMyComment } =
    useMyComment(collaboratorId);

  const { user } = useUser();

  const comments = useMemo(() => {
    const all = data?.pages.flatMap((page) => page?.data || []) ?? [];

    if (!myComment) return all;

    return all.filter((comment) => comment.usuario_id !== myComment.usuario_id);
  }, [data, myComment]);

  const alreadyCommented = !!myComment;
  const skeletons = useMemo(() => Array.from({ length: 4 }), []);

  const handleDelete = useCallback(async () => {
    await deleteMutation.mutateAsync();
  }, [deleteMutation]);

  return (
    <Flex direction="column" gap="3">
      <Heading as="h2" size="4">
        Comentarios Públicos
      </Heading>

      <Flex direction="column" gap="3">
        {isLoading &&
          skeletons.map((_, index) => (
            <Skeleton key={index} loading={isLoading}>
              <Box className="w-full h-24"></Box>
            </Skeleton>
          ))}

        {!isLoading && comments.length === 0 && (
          <Text as="p" size="3">
            No hay comentarios publicos
          </Text>
        )}

        {myComment && (
          <CommentCard
            key={myComment.id}
            comment={myComment}
            handleDelete={handleDelete}
            owner
          />
        )}

        {comments.map((comment, index) => (
          <CommentCard key={comment.id} comment={comment} owner={false} />
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

      {collaboratorId !== user?.uid &&
        !alreadyCommented &&
        !loadingMyComment && <CommentForm collaboratorId={collaboratorId} />}
    </Flex>
  );
}
