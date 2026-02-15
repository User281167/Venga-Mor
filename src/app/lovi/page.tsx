"use client";
import { Card, Flex, Heading, Section, Text, Avatar } from "@radix-ui/themes";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoviPage() {
  const loviImage = PlaceHolderImages.find(p => p.id === 'subscription-bg');

  return (
    <Section className="flex flex-col gap-6 p-4">
      <Heading className="text-4xl font-bold text-primary mb-8 text-center">
        Lovi Venga Mor
      </Heading>

      <Card className="flex flex-col gap-4 w-11/12 max-w-2xl mx-auto items-center text-center bg-card/80 p-6">
        <Avatar
          src={loviImage?.imageUrl}
          fallback="L"
          size="9"
          radius="full"
          className="my-4 border-4 border-primary"
        />
        <Heading>Perfil Oficial de Venga Mor</Heading>
        <Text as="p" className="text-muted-foreground max-w-md">
            Somos el equipo detrás de Venga Mor, dedicados a crear un espacio seguro y emocionante para conectar personas. Nuestra misión es ofrecerte la mejor experiencia con profesionalismo y discreción.
        </Text>
      </Card>
    </Section>
  );
}
