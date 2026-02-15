import { Star, MapPin } from "lucide-react";
import { Text, Flex, Grid, Button } from "@radix-ui/themes";
import Link from "next/link";
import { Collaborator } from "@/types/collaborator";
import React from "react";
import Image from 'next/image';

interface CollaboratorCardProps {
  collaborator: Collaborator;
}

export const CollaboratorCard = React.memo(function CollaboratorCard({ collaborator }: CollaboratorCardProps) {
  const locationLabel = [collaborator.direccion?.ciudad_localidad, collaborator.direccion?.pais].filter(Boolean).join(", ") || "Ubicación no disponible";
  const isVerified = (collaborator.estrellas || 0) > 4.5;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-black">
      {/* Background Image */}
      <Image
        src={collaborator.foto || "https://picsum.photos/seed/1/600/900"}
        alt={collaborator.nombre}
        layout="fill"
        objectFit="cover"
        className="z-0"
        data-ai-hint="woman portrait"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
        <div>
          <h3 className="text-4xl font-bold font-headline text-white">
            {collaborator.nombre} {collaborator.apellido}
          </h3>
          {isVerified && (
             <div className="w-24 h-1 bg-cyan-400 mt-1 rounded-full"></div>
          )}
        </div>
       
        <p className="text-white/90 text-md mt-3 mb-5 italic">
          {collaborator.descripcion ? `"${collaborator.descripcion}"` : ""}
        </p>

        <div className="border-t border-white/20 pt-4">
            <Grid columns="2" gapX="6" gapY="3">
                <Flex direction="column">
                    <Text size="2" className="text-white/70">Edad</Text>
                    <Text size="4" weight="bold">{collaborator.edad}</Text>
                </Flex>
                <Flex direction="column">
                    <Text size="2" className="text-white/70">Profesión</Text>
                    <Text size="4" weight="bold">{collaborator.profesion}</Text>
                </Flex>
                <Flex direction="column">
                    <Text size="2" className="text-white/70">Calificación</Text>
                    <Flex align="center" gap="1">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <Text size="4" weight="bold">{collaborator.estrellas?.toFixed(1) ?? "N/A"}</Text>
                    </Flex>
                </Flex>
                <Flex direction="column">
                     <Text size="2" className="text-white/70">Ubicación</Text>
                    <Flex align="center" gap="1">
                        <MapPin className="h-5 w-5 text-white/80" />
                        <Text size="3" className="truncate">{locationLabel}</Text>
                    </Flex>
                </Flex>
            </Grid>
        </div>
         <Link href={`/perfil-info/${collaborator.uid}`} className="w-full">
            <Button variant="surface" size="3" mt="5" className="w-full cursor-pointer bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm shadow-md">
              Ver más detalles
            </Button>
        </Link>
      </div>
    </div>
  );
});
