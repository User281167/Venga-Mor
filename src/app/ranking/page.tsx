"use client";
import {
  Avatar,
  Card,
  Flex,
  Grid,
  Heading,
  Section,
  Spinner,
  Text,
} from "@radix-ui/themes";
import SectionImg from "@/components/section-img";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useProfilesList } from "@/context/use-profiles-data";
import { Trophy, Star, Heart, Gem } from "lucide-react";
import { Collaborator } from "@/types/collaborator";
import { useMemo } from "react";

// Component to render a single ranked user
const RankingCard = ({
  collaborator,
  rank,
}: {
  collaborator: Collaborator;
  rank: number;
}) => {
  return (
    <Card className="bg-card/80 hover:bg-card/90 transition-all">
      <Flex align="center" gap="4">
        <Text size="6" weight="bold" className="w-10 text-center text-primary">
          {rank}
        </Text>
        <Avatar
          src={collaborator.foto || undefined}
          fallback={collaborator.nombre?.charAt(0)}
          size="4"
          radius="full"
        />
        <Flex direction="column" className="flex-grow">
          <Heading as="h3" size="4">
            {collaborator.nombre} {collaborator.apellido}
          </Heading>
          <Text size="2" color="gray">
            {collaborator.profesion}
          </Text>
        </Flex>
        <Flex align="center" gap="1" className="text-yellow-400">
          <Star size={16} />
          <Text weight="bold">
            {collaborator.estrellas?.toFixed(1) ?? "N/A"}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

// Component for a list
const RankingList = ({
  title,
  icon,
  collaborators,
}: {
  title: string;
  icon: React.ReactNode;
  collaborators: Collaborator[];
}) => (
  <Flex direction="column" gap="4">
    <Heading as="h2" className="flex items-center gap-3 text-2xl text-accent">
      {icon}
      <span>{title}</span>
    </Heading>
    <Flex direction="column" gap="2">
      {collaborators.length > 0 ? (
        collaborators
          .slice(0, 10)
          .map((collab, index) => (
            <RankingCard
              key={collab.uid}
              collaborator={collab}
              rank={index + 1}
            />
          ))
      ) : (
        <Text color="gray">No hay datos para mostrar en este ranking.</Text>
      )}
    </Flex>
  </Flex>
);

export default function RankingPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "profile-bg");

  // Fetching profiles without filters
  const { data, isLoading, isError } = useProfilesList([], [], 0, {});
  const allCollaborators = useMemo(
    () => data?.pages.flatMap((page) => page?.data || []) || [],
    [data],
  );

  const topGlobal = useMemo(
    () =>
      [...allCollaborators].sort(
        (a, b) => (b.estrellas || 0) - (a.estrellas || 0),
      ),
    [allCollaborators],
  );

  const topSemanal = useMemo(
    () => [...allCollaborators].sort(() => 0.5 - Math.random()), // Placeholder sort
    [allCollaborators],
  );

  return (
    <SectionImg imageUrl={bgImage?.imageUrl} imageHint={bgImage?.imageHint}>
      <Heading className="text-4xl font-bold text-primary mb-8 text-center">
        Ranking Top Models
      </Heading>
      <Card className="w-full max-w-4xl mx-auto bg-card/80 p-6">
        {isLoading ? (
          <Flex justify="center" align="center" className="h-64">
            <Spinner size="3" />
            <Text ml="3">Cargando rankings...</Text>
          </Flex>
        ) : isError ? (
          <Flex justify="center" align="center" className="h-64">
            <Text color="red">Error al cargar los perfiles.</Text>
          </Flex>
        ) : (
          <Grid columns={{ initial: "1", md: "2" }} gap="8">
            <RankingList
              title="Top Global"
              icon={<Trophy size={24} />}
              collaborators={topGlobal}
            />
            <RankingList
              title="Top Semanal"
              icon={<Trophy size={24} />}
              collaborators={topSemanal}
            />
          </Grid>
        )}
        <Flex
          direction="column"
          gap="2"
          mt="6"
          p="4"
          className="bg-muted rounded-lg"
        >
          <Heading as="h4" size="3" className="text-center">
            Leyenda de Ranking
          </Heading>
          <Flex justify="center" mt="2">
            <Flex align="center" gap="2">
              <Star size={16} className="text-yellow-400" />{" "}
              <Text size="2">Estrellas</Text>
            </Flex>
            <Flex align="center" gap="2">
              <Heart size={16} className="text-red-500" />{" "}
              <Text size="2">Seguidores</Text>
            </Flex>
            <Flex align="center" gap="2">
              <Gem size={16} className="text-blue-400" />{" "}
              <Text size="2">Joyas</Text>
            </Flex>
          </Flex>
          <Text size="1" color="gray" className="text-center" mt="2">
            Actualmente el ranking se basa en estrellas. ¡Próximamente más
            métricas!
          </Text>
        </Flex>
      </Card>
    </SectionImg>
  );
}
