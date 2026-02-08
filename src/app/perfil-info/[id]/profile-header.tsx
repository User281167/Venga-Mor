"use client";

import { Flex, Heading, Text, Avatar } from "@radix-ui/themes";
import { Collaborator } from "@/types/collaborator";

interface ProfileHeaderProps {
  collaborator: Collaborator;
}

export default function ProfileHeader({ collaborator }: ProfileHeaderProps) {
  return (
    <Flex
      gap="5"
      align="center"
      justify={{ initial: "center", sm: "start" }}
      wrap="wrap"
    >
      <Avatar
        src={collaborator.foto || ""}
        fallback={collaborator.nombre.charAt(0)}
        size="7"
        radius="full"
      />

      <Flex direction="column" gap="1">
        <Heading as="h1" className="text-4xl">
          {collaborator.nombre} {collaborator.apellido}
        </Heading>

        <Text as="p" className="text-muted-foreground">
          "{collaborator.descripcion}"
        </Text>
      </Flex>
    </Flex>
  );
}
