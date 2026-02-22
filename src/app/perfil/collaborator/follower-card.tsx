"use client";
import { FollowerModel } from "@/models/follow.model";
import { Avatar, Flex, Heading, Text } from "@radix-ui/themes";
import React from "react";

interface FollowerCardProps {
  follower: FollowerModel;
}

export const FollowerCard = React.memo(function FollowerCard({
  follower,
}: FollowerCardProps) {
  return (
    <Flex
      key={follower.usuario_id}
      gap="3"
      p="3"
      align="center"
      className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
    >
      <Avatar
        src={follower.avatar || undefined}
        fallback={follower.nombre?.charAt(0)}
        size="3"
      />

      <div className="flex-1">
        <Heading as="h4" size="4" weight="bold">
          {follower.nombre}
        </Heading>

        <Text as="p" size="1" color="gray">
          Siguiendo desde{" "}
          {new Date(follower.fecha || "").toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </div>
    </Flex>
  );
});
