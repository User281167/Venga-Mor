"use client";
import { Share2, Shield } from "lucide-react";
import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import SectionImg from "@/components/section-img";

export default function InfoPage() {
  const logoGif = "https://i.ibb.co/jk9tgFjs/In-Shot-20251127-124506071.gif";

  return (
    <SectionImg imageUrl={logoGif} alt="Info Background" imageHint="logo animation">
      <Flex
        width="90%"
        maxWidth="900px"
        className="mx-auto"
        direction="column"
        gap="4"
      >
        <Heading className="text-4xl font-bold text-primary mb-8 text-center" style={{ fontFamily: "'Playball', cursive" }}>
          Información
        </Heading>

        <Card className="bg-card/80" size="3">
          <Flex direction="column" gap="2">
            <span className="flex items-center gap-2">
              <Share2 className="h-6 w-6 text-primary" />
              <span className="font-bold">Compartir la App</span>
            </span>
          </Flex>

          <Flex direction="column" gap="2">
            <p className="text-muted-foreground mb-4">
              ¿Te gusta nuestra app? ¡Compártela con tus amigos!
            </p>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Compartir ahora
            </Button>
          </Flex>
        </Card>

        <Card className="bg-card/80">
          <Heading as="h2" size="4">Términos y Condiciones</Heading>

          <Flex direction="column" gap="2">
            <Text as="p" className="text-muted-foreground mb-4" size="2">
              Lee nuestros términos de servicio y políticas de uso para una experiencia segura.
            </Text>

            <Button variant="outline" className="w-full">
              Leer Términos
            </Button>
          </Flex>
        </Card>

        <Card className="bg-card/80">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-accent" />
              <span>Política de Privacidad</span>
            </Heading>

            <Text as="p" className="text-muted-foreground mb-4" size="2">
              Tu privacidad es nuestra prioridad absoluta. Conoce cómo protegemos tus datos.
            </Text>

            <Button variant="outline" className="w-full">
              Leer Política
            </Button>
          </Flex>
        </Card>
      </Flex>
    </SectionImg>
  );
}
