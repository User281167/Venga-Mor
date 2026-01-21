'use client'

import { escorts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import { Card, Flex, Heading, Text, Button, Avatar, Section, TextArea } from '@radix-ui/themes';
import { Star, MessageCircle, Diamond, Heart } from 'lucide-react';
import { Separator } from '@radix-ui/themes/components/separator';

export default function ProfileDetailPage({ params }: { params: { id: string } }) {
  const escort = escorts.find(e => e.id === params.id);

  if (!escort) {
    notFound();
  }

  const profileImage = PlaceHolderImages.find(p => p.id === escort.imageId);

  return (
    <Section className="py-8 px-4">
      <Card className="max-w-2xl mx-auto bg-card/80">
        <Flex direction="column" gap="5">
          {/* Header */}
          <Flex gap="5" align="center">
            {profileImage && (
              <Avatar
                src={profileImage.imageUrl}
                fallback={escort.name.charAt(0)}
                size="7"
                radius="full"
              />
            )}
            <Flex direction="column" gap="1">
              <Heading as="h1" className="text-4xl">{escort.name}</Heading>
              <Text as="p" className="text-muted-foreground">"{escort.phrase}"</Text>
            </Flex>
          </Flex>

          {/* Action Buttons */}
          <Flex gap="3">
            <Button className="flex-1 bg-primary">
              <MessageCircle className="mr-2 h-4 w-4" /> Enviar Mensaje
            </Button>
            <Button variant="soft" className="flex-1">
              <Heart className="mr-2 h-4 w-4" /> Seguir
            </Button>
            <Button variant="soft" className="flex-1">
              <Diamond className="mr-2 h-4 w-4" /> Enviar Joyas
            </Button>
          </Flex>

          <Separator my="3" size="4" />

          {/* About Section */}
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">Sobre {escort.name}</Heading>
            <Text as="p">
              Aquí iría una descripción más detallada sobre la persona, sus gustos, lo que busca en la plataforma, etc. Por ahora es un texto de ejemplo.
            </Text>
            <Flex gap="4" mt="2">
                <Text><strong>Edad:</strong> {escort.age}</Text>
                <Text><strong>Ubicación:</strong> Bogotá</Text>
            </Flex>
          </Flex>

          <Separator my="3" size="4" />

          {/* Rating Section */}
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">Calificación</Heading>
            <Flex align="center" gap="2">
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              <Star className="h-6 w-6 text-gray-500" />
              <Text weight="bold">(4.0 de 5)</Text>
            </Flex>
            <Text as="p" size="2" className="text-muted-foreground">Deja tu calificación para ayudar a otros.</Text>
          </Flex>

          <Separator my="3" size="4" />

          {/* Comments Section */}
          <Flex direction="column" gap="3">
            <Heading as="h2" size="4">Comentarios Públicos</Heading>
            <Flex direction="column" gap="3">
                {/* Example Comment */}
                <Card>
                    <Flex direction="column" gap="1">
                        <Text weight="bold">Usuario123</Text>
                        <Text size="2" className="text-muted-foreground">Hace 2 días</Text>
                        <Text as="p" mt="2">Una experiencia increíble, muy recomendada. Profesional y amable.</Text>
                    </Flex>
                </Card>
                <Card>
                    <Flex direction="column" gap="1">
                        <Text weight="bold">OtroUsuario</Text>
                        <Text size="2" className="text-muted-foreground">Hace 1 semana</Text>
                        <Text as="p" mt="2">Excelente compañía para eventos.</Text>
                    </Flex>
                </Card>
            </Flex>

            <Flex direction="column" gap="2" mt="4">
              <TextArea placeholder="Escribe tu comentario público aquí..." />
              <Button className="self-end">Publicar Comentario</Button>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Section>
  );
}
