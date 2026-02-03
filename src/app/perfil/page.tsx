"use client";
import { useUser } from "@/context/user-context";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Heading,
  Section,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import Image from "next/image";

import FormUserInfo from "./user-form";
import CollaboratorForm from "./collaborator/collaborator-form";
import MediaUploadPanel from "./media/media-upload-media";
import FollowingList from "./following-list";
import FollowersList from "./collaborator/followers-list";

export default function PerfilPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "profile-bg");
  const { user, loading, logout } = useUser();

  return (
    <Section className="min-h-screen min-w-full flex flex-col gap-4 items-center justify-center px-4 text-center bg-primary/10 overflow-hidden">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt="Introducción Venga Mor"
          unoptimized
          priority
          className="fixed left-0 top-0 -z-10 h-screen w-full opacity-30 object-cover object-center"
          data-ai-hint={bgImage.imageHint}
          width={1920}
          height={1080}
        />
      )}

      <Heading className="text-4xl font-bold text-primary mb-8 text-center">
        Mi Perfil
      </Heading>

      <Card className="bg-card/80 w-full max-w-screen-lg">
        <Flex
          className="pt-6 flex flex-col items-center max-w-xl mx-auto"
          gap="4"
        >
          <Avatar
            className="h-24 w-24 border-2 border-primary"
            src={user?.foto || undefined}
            fallback={user?.nombre?.charAt(0) || "U"}
          />

          <Skeleton loading={loading} width="180px" height="1.75rem">
            <Heading as="h2" className="text-2xl font-bold">
              {user?.nombre} {user?.apellido}
            </Heading>
          </Skeleton>

          <Skeleton loading={loading} width="260px" height="1.25rem">
            <Text as="p" className="text-muted-foreground">
              {user?.email}
            </Text>
          </Skeleton>

          <Skeleton loading={loading} width="260px" height="1.25rem">
            <Text as="p" className="text-muted-foreground">
              Registrado el{" "}
              {new Date(user?.creado ?? new Date()).toLocaleDateString()}
            </Text>
          </Skeleton>

          <FormUserInfo user={user} />
          <CollaboratorForm loading={loading} />
          <FollowingList />

          <Skeleton
            loading={loading}
            className="h-64 w-full max-w-screen-lg mx-auto rounded-lg"
          >
            {user?.tipo === "colaborador" && (
              <FollowersList colaboradorId={user.uid} />
            )}
          </Skeleton>

          <Button
            variant="outline"
            className="w-full"
            onClick={logout}
            disabled={loading}
          >
            Cerrar Sesión
          </Button>
        </Flex>
      </Card>

      <Skeleton
        loading={loading}
        className="h-64 w-full max-w-screen-lg mx-auto rounded-lg"
      >
        {user?.tipo === "colaborador" && <MediaUploadPanel />}
      </Skeleton>
    </Section>
  );
}
