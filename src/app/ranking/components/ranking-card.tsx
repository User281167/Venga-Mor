"use client";

import { Avatar, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Star } from "lucide-react";

import { Collaborator } from "@/types/collaborator";
import Link from "next/link";

export function RankingCard({
  collaborator,
  rank,
}: {
  collaborator: Collaborator;
  rank: number;
}) {
  const starsText =
    collaborator.estrellas > 0 ? collaborator.estrellas.toFixed(1) : "N/A";

  return (
    <Link href={`/perfil-info/${collaborator.uid}`}>
      <Card className="border border-white/10 bg-black/20 backdrop-blur-sm transition-transform hover:-translate-y-0.5 hover:bg-black/30">
        <Flex align="center" gap="4">
          <Text
            size="6"
            weight="bold"
            className="w-10 text-center text-primary"
          >
            {rank}
          </Text>

          <Avatar
            src={collaborator.foto || undefined}
            fallback={collaborator.nombre?.charAt(0)}
            size="4"
            radius="full"
          />

          <Flex direction="column" className="min-w-0 flex-1">
            <Heading as="h3" size="4" className="truncate">
              {collaborator.nombre} {collaborator.apellido}
            </Heading>

            <Text size="2" color="gray" className="truncate">
              {collaborator.profesion}
            </Text>
          </Flex>

          <Flex align="center" gap="1" className="shrink-0 text-yellow-400">
            <Star size={16} />
            <Text weight="bold">{starsText}</Text>
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
