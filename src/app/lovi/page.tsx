"use client";
import { Button, Card, Flex, Heading, Section, Text, Avatar } from "@radix-ui/themes";
import { Youtube, Instagram, FileText } from "lucide-react";
import Link from "next/link";

export default function LoviPage() {
  const loviImage = "https://picsum.photos/seed/bubble/200/200";

  return (
    <Section className="flex flex-col gap-6 p-4">
      <Heading className="text-4xl font-bold text-primary mb-8 text-center">
        Lovi Venga Mor
      </Heading>

      <Card className="flex flex-col gap-4 w-11/12 max-w-2xl mx-auto items-center text-center bg-card/80 p-6">
        <Avatar
          src={loviImage}
          fallback="L"
          size="9"
          radius="full"
          className="my-4 border-4 border-primary"
          data-ai-hint="abstract bubble"
        />
        <Heading>Perfil Oficial de Venga Mor</Heading>
        <Text as="p" className="text-muted-foreground max-w-md">
            Somos el equipo detrás de Venga Mor, dedicados a crear un espacio seguro y emocionante para conectar personas. Nuestra misión es ofrecerte la mejor experiencia con profesionalismo y discreción.
        </Text>
        <Flex direction="column" gap="3" mt="4" className="w-full max-w-xs">
            <Button asChild size="3" variant="soft">
                <Link href="https://youtube.com/shorts/fBCA7sUDATo?si=pH09_oLtIPLpl4W1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                    <Youtube />
                    Canal de YouTube
                </Link>
            </Button>
            <Button asChild size="3" variant="soft">
                <Link href="https://www.instagram.com/venga_sex?igsh=MTV2Z3ZubWFqamtrMg==" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                    <Instagram />
                    Tienda en Instagram
                </Link>
            </Button>
             <Button asChild size="3" variant="soft">
                <Link href="https://o720rb8u.forms.app/mi-impresionante-formulario" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                    <FileText />
                    Quejas y Reclamos
                </Link>
            </Button>
        </Flex>
      </Card>
    </Section>
  );
}
