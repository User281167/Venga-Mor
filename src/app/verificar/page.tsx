"use client";

import { Button, Card, Flex, Heading, Section, Text } from "@radix-ui/themes";
import SectionImg from "@/components/section-img";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ShieldCheck } from "lucide-react";
import VerificationPayPalButton from "@/components/verification-paypal-button";
import { useUser } from "@/context/user-context";
import Link from "next/link";
import { useState } from "react";
import Confetti from "react-confetti";

export default function VerifyPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "subscription-bg");
  const { user, loading } = useUser();
  const [success, setSuccess] = useState(false);

  if (loading) {
    return (
      <SectionImg imageUrl={bgImage?.imageUrl} imageHint={bgImage?.imageHint}>
        <Heading>Cargando...</Heading>
      </SectionImg>
    );
  }

  if (!user) {
    return (
      <SectionImg imageUrl={bgImage?.imageUrl} imageHint={bgImage?.imageHint}>
        <Card className="p-6 bg-card/80 text-center">
          <Heading>Debes iniciar sesión</Heading>
          <Text as="p" mt="2">
            Para verificar tu perfil, primero necesitas iniciar sesión.
          </Text>
          <Button asChild mt="4">
            <Link href="/iniciar-sesion">Iniciar Sesión</Link>
          </Button>
        </Card>
      </SectionImg>
    );
  }

  if (success) {
    return (
      <SectionImg imageUrl={bgImage?.imageUrl} imageHint={bgImage?.imageHint}>
        <Confetti />

        <Card className="p-6 bg-card/80 text-center">
          <Heading>Perfil verificado</Heading>

          <Text as="p" mt="2">
            Tu perfil ya cuenta con la insignia de verificación.
          </Text>
          <Button asChild mt="4">
            <Link href="/perfil">Ir a mi perfil</Link>
          </Button>
        </Card>
      </SectionImg>
    );
  }

  if (user.verificado) {
    return (
      <SectionImg imageUrl={bgImage?.imageUrl} imageHint={bgImage?.imageHint}>
        <Card className="p-6 bg-card/80 text-center">
          <ShieldCheck className="h-12 w-12 text-green-500 mx-auto" />
          <Heading mt="2">¡Ya estás verificado!</Heading>
          <Text as="p" mt="2">
            Tu perfil ya cuenta con la insignia de verificación.
          </Text>
          <Button asChild mt="4">
            <Link href="/perfil">Ir a mi perfil</Link>
          </Button>
        </Card>
      </SectionImg>
    );
  }

  return (
    <SectionImg imageUrl={bgImage?.imageUrl} imageHint={bgImage?.imageHint}>
      <Card className="w-full max-w-md p-6 text-center bg-card/80">
        <ShieldCheck className="h-12 w-12 text-primary mx-auto" />
        <Heading mt="2">Verifica tu Perfil</Heading>
        <Text as="p" mt="2" color="gray">
          Obtén la insignia de verificación para dar más confianza a otros
          usuarios. Es un pago único.
        </Text>

        <Flex direction="column" gap="3" mt="6">
          <VerificationPayPalButton setSuccess={setSuccess} />
        </Flex>
      </Card>
    </SectionImg>
  );
}
