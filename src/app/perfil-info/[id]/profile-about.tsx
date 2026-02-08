"use client";

import { Flex, Heading, Text } from "@radix-ui/themes";
import { Collaborator } from "@/types/collaborator";

interface ProfileAboutProps {
  collaborator: Collaborator;
}

export default function ProfileAbout({ collaborator }: ProfileAboutProps) {
  return (
    <Flex direction="column" gap="2">
      <Heading as="h2" size="4">
        Sobre {collaborator.nombre}
      </Heading>

      <Text as="p">{collaborator.descripcion}</Text>

      <Flex gap="4" mt="2">
        <Text>
          <strong>Edad:</strong> {collaborator.edad}
        </Text>

        <Text>
          <strong>Ubicación:</strong> {collaborator.direccion?.pais}{" "}
          {collaborator.direccion?.estado_region}{" "}
          {collaborator.direccion?.ciudad_localidad}
        </Text>
      </Flex>
    </Flex>
  );
}
