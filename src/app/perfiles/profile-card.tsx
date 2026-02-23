import {
  Star,
  MapPin,
  Heart,
  MessageCircle,
  Diamond,
  CheckCircle2,
} from "lucide-react";
import { Text, Flex, Grid, Button, Badge, Dialog } from "@radix-ui/themes";
import Link from "next/link";
import { Collaborator } from "@/types/collaborator";
import React from "react";
import Image from "next/image";
import PayPalPayment from "@/components/pay-pal";

interface CollaboratorCardProps {
  collaborator: Collaborator;
}

export const CollaboratorCard = React.memo(function CollaboratorCard({
  collaborator,
}: CollaboratorCardProps) {
  const locationLabel =
    [collaborator.direccion?.ciudad_localidad, collaborator.direccion?.pais]
      .filter(Boolean)
      .join(", ") || "Ubicación no disponible";
  const isVerified = collaborator.verificado;

  return (
    <div className="relative w-full h-full group">
      <div className="relative w-full h-full overflow-hidden bg-black">
        {/* Background Image */}
        <Image
          src={collaborator.foto || "https://picsum.photos/seed/1/600/900"}
          alt={collaborator.nombre || "Imagen de perfil"}
          layout="fill"
          objectFit="cover"
          className="z-0 transition-transform duration-500 group-hover:scale-110"
          data-ai-hint="woman portrait"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>

        {/* Action Buttons (Right) */}
        <Flex
          direction="column"
          gap="4"
          align="center"
          className="absolute bottom-24 right-4 text-white z-30"
        >
          <Button
            variant="ghost"
            className="text-white h-auto flex flex-col items-center"
          >
            <Heart size={32} />
            <Text size="1">{collaborator.seguidoresCount ?? 0}</Text>
          </Button>

          <Button
            variant="ghost"
            className="text-white h-auto flex flex-col items-center"
          >
            <MessageCircle size={32} />
            <Text size="1">{collaborator.comentariosCount ?? 0}</Text>
          </Button>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="ghost" className="text-white h-auto z-30">
                <Diamond size={32} />
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>Comprar Joyas</Dialog.Title>

              <Dialog.Description size="2" mb="4">
                Apoya a {collaborator?.nombre} enviándole joyas.
              </Dialog.Description>

              <PayPalPayment />

              <Flex mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft">Cerrar</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>

        {/* Content (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
          <div>
            <Flex align="center" gap="3">
              <h3 className="text-4xl font-bold font-headline text-white">
                {collaborator.nombre} {collaborator.apellido}
              </h3>

              {isVerified && (
                <Flex direction="column" align="start">
                  <Flex align="center" gap="1">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400" />

                    <Text size="2" weight="bold" className="text-cyan-400">
                      Oficial
                    </Text>
                  </Flex>

                  <div className="w-full h-[2px] bg-cyan-400 mt-1 rounded-full"></div>
                </Flex>
              )}
            </Flex>
          </div>

          <p className="text-white/90 text-md mt-3 mb-5 italic line-clamp-2">
            {collaborator.descripcion ? `"${collaborator.descripcion}"` : ""}
          </p>

          <Flex wrap="wrap" gap="2" mb="4">
            {collaborator.categorias?.map((cat) => (
              <Badge key={cat} variant="soft">
                {cat}
              </Badge>
            ))}
          </Flex>

          <div className="border-t border-white/20 pt-4">
            <Grid columns="2" gapX="6" gapY="3">
              <Flex direction="column">
                <Text size="2" className="text-white/70">
                  Edad
                </Text>

                <Text size="4" weight="bold">
                  {collaborator.edad}
                </Text>
              </Flex>

              <Flex direction="column">
                <Text size="2" className="text-white/70">
                  Profesión
                </Text>

                <Text size="4" weight="bold">
                  {collaborator.profesion}
                </Text>
              </Flex>

              <Flex direction="column">
                <Text size="2" className="text-white/70">
                  Calificación
                </Text>

                <Flex align="center" gap="1">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />

                  <Text size="4" weight="bold">
                    {collaborator.estrellas?.toFixed(1) ?? "N/A"}
                  </Text>
                </Flex>
              </Flex>
              <Flex direction="column">
                <Text size="2" className="text-white/70">
                  Ubicación
                </Text>

                <Flex align="center" gap="1">
                  <MapPin className="h-5 w-5 text-white/80" />

                  <Text size="3" className="truncate">
                    {locationLabel}
                  </Text>
                </Flex>
              </Flex>
            </Grid>
          </div>
        </div>
      </div>

      <Link
        href={`/perfil-info/${collaborator.uid}`}
        className="absolute inset-0 z-20 w-full h-full"
        aria-label={`Ver perfil de ${collaborator.nombre}`}
      />
    </div>
  );
});
