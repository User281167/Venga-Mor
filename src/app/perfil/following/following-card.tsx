"use client";

import { FollowingModel } from "@/app/models/follow.model";
import { Avatar, Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

interface FollowingCardProps {
  user: FollowingModel;
}

export const FollowingCard = React.memo(function FollowingCard({
  user,
}: FollowingCardProps) {
  return (
    <Link
      key={user?.colaborador_id}
      href={`/perfil-info/${user?.colaborador_id}`}
      className="block"
    >
      <Flex
        gap="3"
        p="3"
        align="center"
        className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Avatar
          src={user?.avatar || undefined}
          fallback={user?.nombre.charAt(0)}
          size="3"
        />

        <div className="flex-1">
          <Heading as="h4" size="4" weight="bold">
            {user?.nombre}
          </Heading>

          <Text as="p" size="1" color="gray">
            Siguiendo desde{" "}
            {new Date(user?.fecha || "").toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </div>
      </Flex>
    </Link>
  );
});
