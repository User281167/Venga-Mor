"use client";
import { useUser } from "@/context/user-context";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Heading,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

import FormUserInfo from "./user-form";
import CollaboratorForm from "./collaborator/collaborator-form";
import MediaUploadPanel from "./media/media-upload-media";
import FollowingList from "./following/following-list";
import FollowersList from "./collaborator/followers-list";
import SectionImg from "@/components/section-img";

export default function PerfilPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "profile-bg");
  const { user, loading, logout } = useUser();

  return (
    <SectionImg imageUrl={bgImage?.imageUrl} imageHint={bgImage?.description}>
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

          <Flex align="center" gap="2">
            <Skeleton loading={loading} width="180px" height="1.75rem">
              <Heading as="h2" className="text-2xl font-bold">
                {user?.nombre} {user?.apellido}
              </Heading>
            </Skeleton>

            {user?.verificado && (
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            )}
          </Flex>

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

          <Skeleton
            loading={loading}
            className="h-8 w-full max-w-screen-lg mx-auto rounded-lg"
          >
            <FormUserInfo user={user} />
          </Skeleton>

          <CollaboratorForm loading={loading} />
          <FollowingList loading={loading} />

          <Skeleton
            loading={loading}
            className="h-8 w-full max-w-screen-lg mx-auto rounded-lg"
          >
            {user?.tipo === "colaborador" && (
              <FollowersList colaboradorId={user.uid} />
            )}
          </Skeleton>

          {!loading && !user?.verificado && (
            <Button
              asChild
              variant="solid"
              className="w-full bg-yellow-500 hover:bg-yellow-600"
            >
              <Link href="/verificar">
                <ShieldCheck className="mr-2 h-4 w-4" /> Verificar Perfil
              </Link>
            </Button>
          )}

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
    </SectionImg>
  );
}
