"use client";

import { Flex, Heading, Text } from "@radix-ui/themes";
import { Gem, Heart, Star } from "lucide-react";

export function RankingLegend() {
  return (
    <Flex
      direction="column"
      gap="2"
      mt="6"
      p="4"
      className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm"
    >
      <Heading as="h4" size="3" className="text-center">
        Leyenda de Ranking
      </Heading>

      <Flex justify="center" wrap="wrap" gap="4" mt="2">
        <Flex align="center" gap="2">
          <Star size={16} className="text-yellow-400" />
          <Text size="2">Estrellas</Text>
        </Flex>

        <Flex align="center" gap="2">
          <Heart size={16} className="text-red-500" />
          <Text size="2">Seguidores</Text>
        </Flex>

        <Flex align="center" gap="2">
          <Gem size={16} className="text-blue-400" />
          <Text size="2">Joyas</Text>
        </Flex>
      </Flex>

      <Text size="1" color="gray" className="text-center" mt="2">
        El orden cambia según el selector: estrellas o seguidores.
      </Text>
    </Flex>
  );
}
