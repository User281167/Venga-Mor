import { Star, MapPin, Diamond } from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  DataList,
  Flex,
  Grid,
  Text,
} from "@radix-ui/themes";
import Link from "next/link";
import { Collaborator } from "@/types/collaborator";

interface CollaboratorCardProps {
  collaborator: Collaborator;
}

export function CollaboratorCard({ collaborator }: CollaboratorCardProps) {
  const locationLabel =
    [collaborator.direccion?.ciudad_localidad, collaborator.direccion?.pais]
      .filter(Boolean)
      .join(", ") || "Ubicación no disponible";

  return (
    <Card className="bg-card/50 hover:bg-card/0 shadow-xl hover:shadow-primary/30 transition-all duration-300 w-full hover:scale-[1.02] p-3 md:p-6">
      <Grid columns={{ initial: "1", xs: "2" }} gap="4" justify="center">
        <Avatar
          className="w-full"
          size="9"
          src={collaborator.foto || ""}
          fallback={collaborator.nombre?.charAt(0)}
        />

        <div>
          <h3 className="text-2xl font-bold text-accent font-headline">
            {collaborator.nombre} {collaborator.apellido}
          </h3>

          <p className="text-muted-foreground text-sm mt-1 italic">
            {collaborator.descripcion}
          </p>

          <div className="flex items-center space-x-2 mt-2">
            {collaborator.intereses.map((interest, index) => (
              <Badge key={interest + index} variant="soft">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <DataList.Root className="w-full">
          <DataList.Item>
            <DataList.Label>Edad</DataList.Label>
            <DataList.Value>{collaborator.edad}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Profesión</DataList.Label>
            <DataList.Value>{collaborator.profesion}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>Orientación</DataList.Label>
            <DataList.Value>{collaborator.orientacion_sexual}</DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <Flex direction="column" gap="3">
          <Text
            as="p"
            className="flex items-center space-x-1 text-white md:col-span-2"
          >
            <MapPin className="h-5 w-5" />
            <span>{locationLabel}</span>
          </Text>

          <div className="flex items-center space-x-1 text-yellow-400">
            <Star className="h-5 w-5 fill-current" />
            <span className="font-bold text-white">
              {collaborator.estrellas ?? "N/A"}
            </span>
          </div>
        </Flex>

        <Link
          href={`/perfil-info/${collaborator.uid}`}
          className="w-full cursor-pointer"
        >
          <Button variant="outline" className="w-full cursor-pointer">
            Visitar Perfil
          </Button>
        </Link>

        <Button className="bg-primary text-primary-foreground cursor-pointer">
          <Diamond className="h-4 w-4" />
          Enviar Joyas
        </Button>
      </Grid>
    </Card>
  );
}
