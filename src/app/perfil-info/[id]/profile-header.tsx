"use client";

import { Flex, Heading, Text, Avatar } from "@radix-ui/themes";
import { Collaborator } from "@/types/collaborator";
import { CheckCircle2 } from "lucide-react";

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
        <Flex align="center" gap="3">
          <Heading as="h1" className="text-4xl">
            {collaborator.nombre} {collaborator.apellido}
          </Heading>

          {collaborator.verificado && (
            <Flex direction="column" align="start">
              <Flex align="center" gap="1">
                <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                <Text size="3" weight="bold" className="text-cyan-400">
                  Oficial
                </Text>
              </Flex>
              <div className="w-full h-[2px] bg-cyan-400 mt-1 rounded-full"></div>
            </Flex>
          )}
        </Flex>

        <Text as="p" className="text-muted-foreground">
          "{collaborator.descripcion}"
        </Text>
      </Flex>
    </Flex>
  );
}
