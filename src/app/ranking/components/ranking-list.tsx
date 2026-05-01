"use client";

import { Button, Flex, Heading, Select, Spinner, Text } from "@radix-ui/themes";
import { ChevronDown, Trophy } from "lucide-react";

import type { RankingOrderBy } from "@/handlers/getRankingCollaborators";
import { Collaborator } from "@/types/collaborator";

import { RankingCard } from "./ranking-card";

export function RankingList({
  title,
  collaborators,
  hasNextPage,
  isFetchingNextPage,
  orderBy,
  onOrderByChange,
  onLoadMore,
}: {
  title: string;
  collaborators: Collaborator[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  orderBy: RankingOrderBy;
  onOrderByChange: (value: string) => void;
  onLoadMore: () => void;
}) {
  return (
    <Flex direction="column" gap="4">
      <Flex justify="between">
        <Heading
          as="h2"
          className="flex items-center gap-3 text-2xl text-primary"
        >
          <Trophy size={24} />
          <span>{title}</span>
        </Heading>

        <Select.Root value={orderBy} onValueChange={onOrderByChange}>
          <Select.Trigger />

          <Select.Content>
            <Select.Group>
              <Select.Item value="estrellas">Estrellas</Select.Item>
              <Select.Item value="seguidores">Seguidores</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>

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
