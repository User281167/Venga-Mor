"use client";

import { Button, Flex, Heading, Spinner, Text } from "@radix-ui/themes";
import { ChevronDown, Trophy } from "lucide-react";

import { Collaborator } from "@/types/collaborator";

import { RankingCard } from "./ranking-card";

export function RankingList({
  title,
  collaborators,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  title: string;
  collaborators: Collaborator[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}) {
  return (
    <Flex direction="column" gap="4">
      <Heading
        as="h2"
        className="flex items-center gap-3 text-2xl text-primary"
      >
        <Trophy size={24} />
        <span>{title}</span>
      </Heading>

      <Flex direction="column" gap="2">
        {collaborators.length > 0 ? (
          collaborators.map((collaborator, index) => (
            <RankingCard
              key={collaborator.uid}
              collaborator={collaborator}
              rank={index + 1}
            />
          ))
        ) : (
          <Text color="gray">No hay datos para mostrar en este ranking.</Text>
        )}
      </Flex>

      {hasNextPage && (
        <Button
          variant="soft"
          onClick={onLoadMore}
          disabled={isFetchingNextPage}
          className="w-full"
        >
          {isFetchingNextPage ? (
            <Spinner size="1" />
          ) : (
            <ChevronDown size={16} />
          )}
          {isFetchingNextPage ? "Cargando mas" : "Ver mas"}
        </Button>
      )}
    </Flex>
  );
}
