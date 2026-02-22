import { Collaborator } from "@/types/collaborator";
import {
  Flex,
  Heading,
  Text,
  Badge,
  Separator,
  Card,
  Strong,
  Box,
} from "@radix-ui/themes";

interface ProfileAboutProps {
  collaborator: Collaborator;
}

export default function ProfileAbout({ collaborator }: ProfileAboutProps) {
  // Pequeña helper para mostrar ubicación de forma natural
  const location = [
    collaborator.direccion?.ciudad_localidad,
    collaborator.direccion?.estado_region,
    collaborator.direccion?.pais,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card size="3" variant="surface">
      <Flex direction="column" gap="5">
        {/* Título más atractivo y sin repetir el nombre */}
        <Heading as="h2" size="5" weight="bold" align="center" mb="1">
          Quién soy
        </Heading>

        {/* Descripción principal con algo de estilo */}
        <Box>
          <Text size="4" color="gray" highContrast>
            {collaborator.descripcion ||
              "Sin descripción aún... pero seguro tiene mucho que contar ✨"}
          </Text>
        </Box>

        <Separator my="3" size="4" />

        <Flex wrap="wrap" gap={{ initial: "4", sm: "7", md: "9" }}>
          {/* Información clave en formato más visual y moderno */}
          <Flex direction="column" gap="3">
            <Flex align="center" gap="2">
              <Badge color="bronze" variant="soft" size="2">
                Seguidores
              </Badge>
              <Text size="3">
                <Strong>{collaborator.seguidoresCount ?? 0}</Strong> seguidores
              </Text>
            </Flex>

            <Flex align="center" gap="2">
              <Badge color="gray" variant="soft" size="2">
                Edad
              </Badge>
              <Text size="3">
                <Strong>{collaborator.edad}</Strong> años
              </Text>
            </Flex>

            {location && (
              <Flex align="center" gap="2">
                <Badge color="blue" variant="soft" size="2">
                  Ubicación
                </Badge>
                <Text size="3">{location}</Text>
              </Flex>
            )}

            {collaborator.profesion && (
              <Flex align="center" gap="2">
                <Badge color="purple" variant="soft" size="2">
                  Profesión
                </Badge>
                <Text size="3">
                  <Strong>{collaborator.profesion}</Strong>
                </Text>
              </Flex>
            )}

            {collaborator.altura > 0 && (
              <Flex align="center" gap="2">
                <Badge color="amber" variant="soft" size="2">
                  Altura
                </Badge>
                <Text size="3">{collaborator.altura} cm</Text>
              </Flex>
            )}
          </Flex>

          <Flex direction="column" gap="3">
            {/* Intereses - si existen se muestran como tags */}
            {collaborator.intereses?.length > 0 && (
              <>
                <Box>
                  <Text size="2" weight="medium" mb="2" as="div">
                    Me apasiona
                  </Text>
                  <Flex wrap="wrap" gap="2">
                    {collaborator.intereses.map((interes) => (
                      <Badge
                        key={interes}
                        variant="outline"
                        color="grass"
                        size="2"
                      >
                        {interes}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              </>
            )}

            {/* Opcional: categorías como chips */}
            {collaborator.categorias?.length > 0 && (
              <Box mt="3">
                <Text size="2" weight="medium" mb="2" as="div">
                  Categorías
                </Text>
                <Flex wrap="wrap" gap="2">
                  {collaborator.categorias.map((cat) => (
                    <Badge key={cat} variant="solid" color="violet" size="1">
                      {cat}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
