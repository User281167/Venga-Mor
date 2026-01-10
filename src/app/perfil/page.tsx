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
  Text,
} from "@radix-ui/themes";
import { logout } from "./handler";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FormUserInfo from "./form-user-info";

export default function PerfilPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "profile-bg");

  const { user, loading, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/iniciar-sesion");
    }
  }, [user, loading, router]);

  function logoutHandler() {
    logout(setUser);
  }

  return (
    <Section className="relative min-h-screen min-w-full flex flex-col items-center justify-center px-4 text-center bg-primary/10 overflow-hidden">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt="Introducción Venga Mor"
          unoptimized
          priority
          className="absolute -z-10 h-screen w-full opacity-30 object-cover object-center"
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

          <Heading as="h2" className="text-2xl font-bold">
            {user?.nombre} {user?.apellido}
          </Heading>

          <Text as="p" className="text-muted-foreground">
            {user?.email}
          </Text>

          <FormUserInfo user={user} />

          <Button variant="outline" className="w-full" onClick={logoutHandler}>
            Cerrar Sesión
          </Button>
        </Flex>
      </Card>
    </Section>
  );
}
