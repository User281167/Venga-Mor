"use client";
import { Share2, Shield } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button, Card, Flex, Heading, Section, Text } from "@radix-ui/themes";

export default function InfoPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "info-bg");

  return (
    <Section className="relative min-h-[calc(100vh-128px)]">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          unoptimized
          priority
          className="absolute -z-10 h-full w-full opacity-30 object-cover object-center"
          data-ai-hint={bgImage.imageHint}
          width={1920}
          height={1080}
        />
      )}

      <Flex
        width="90%"
        maxWidth="900px"
        className="mx-auto"
        direction="column"
        gap="4"
      >
        <Heading className="text-4xl font-bold text-primary mb-8 text-center">
          Información
        </Heading>

        <Card className="bg-card/80" size="3">
          <Flex direction="column" gap="2">
            <span className="flex items-center gap-2">
              <Share2 className="h-6 w-6 text-accent" />
              <span>Compartir la App</span>
            </span>
          </Flex>

          <Flex direction="column" gap="2">
            <p className="text-muted-foreground mb-4">
              ¿Te gusta nuestra app? ¡Compártela con tus amigos!
            </p>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Compartir ahora
            </Button>
          </Flex>
        </Card>

        <Card className="bg-card/80">
          <Heading as="h2">Términos y Condiciones</Heading>

          <Flex direction="column" gap="2">
            <Text as="p" className="text-muted-foreground mb-4">
              Lee nuestros términos de servicio y políticas de uso.
            </Text>

            <Button variant="outline" className="w-full">
              Leer Términos
            </Button>
          </Flex>
        </Card>

        <Card className="bg-card/80">
          <Flex direction="column" gap="2">
            <Heading as="h2" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-accent" />
              <span>Política de Privacidad</span>
            </Heading>

            <Text as="p" className="text-muted-foreground mb-4">
              Tu privacidad es importante. Conoce cómo manejamos tus datos.
            </Text>

            <Button variant="outline" className="w-full">
              Leer Política
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Section>
  );
}
