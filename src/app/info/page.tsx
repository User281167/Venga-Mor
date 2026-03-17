
"use client";
import { Share2, Shield } from "lucide-react";
import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import SectionImg from "@/components/section-img";

export default function InfoPage() {
  const logoGif = "https://i.ibb.co/jk9tgFjs/In-Shot-20251127-124506071.gif";

  return (
    <SectionImg imageUrl={logoGif} alt="Info Background" imageHint="logo animation">
      <Flex
        width="95%"
        maxWidth="900px"
        className="mx-auto"
        direction="column"
        gap="4"
      >
        <Heading 
          className="text-5xl font-bold text-primary mb-8 text-center" 
          style={{ fontFamily: "'Playball', cursive", textShadow: "0 0 25px rgba(255,0,85,0.6)" }}
        >
          Información
        </Heading>

        <Card className="bg-black/60 backdrop-blur-xl border-white/10" size="3">
          <Flex direction="column" gap="2">
            <span className="flex items-center gap-2">
              <Share2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Compartir App</span>
            </span>
            <p className="text-muted-foreground mb-4">
              ¿Te gusta la experiencia Venga Mor? ¡Compártela con tus amigos!
            </p>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 font-bold">
              Compartir ahora
            </Button>
          </Flex>
        </Card>

        <Card className="bg-black/60 backdrop-blur-xl border-white/10">
          <Heading as="h2" size="4" className="mb-2">Términos y Condiciones</Heading>
          <Text as="p" className="text-muted-foreground mb-4" size="2">
            Lee nuestros términos de servicio para una experiencia segura.
          </Text>
          <Button variant="outline" className="w-full border-white/20 rounded-xl h-10">
            Leer Términos
          </Button>
        </Card>

        <Card className="bg-black/60 backdrop-blur-xl border-white/10">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4" className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-accent" />
              <span>Privacidad</span>
            </Heading>
            <Text as="p" className="text-muted-foreground mb-4" size="2">
              Tus datos están protegidos de extremo a extremo.
            </Text>
            <Button variant="outline" className="w-full border-white/20 rounded-xl h-10">
              Leer Política
            </Button>
          </Flex>
        </Card>
      </Flex>
    </SectionImg>
  );
}
