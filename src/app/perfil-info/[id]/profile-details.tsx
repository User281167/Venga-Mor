"use client";

import { escorts } from "@/lib/data";
import { useRouter } from "next/navigation";
import {
  Card,
  Flex,
  Heading,
  Text,
  Button,
  Avatar,
  Dialog,
} from "@radix-ui/themes";
import { Separator } from "@radix-ui/themes/components/separator";
import { Star, MessageCircle, Diamond, Heart } from "lucide-react";
import { useState } from "react";

import PayPalPayment from "@/components/pay-pal";
import SectionImg from "@/components/section-img";

import { Collaborator } from "@/types/collaborator";
import PostCarousel from "./posts/post-carousel";
import Comments from "./comments/comments";
import { useToggleFollow } from "@/hooks/useFollow";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";

export default function ProfileDetail({
  collaborator,
}: {
  collaborator: Collaborator;
}) {
  const escort = escorts[0];
  const router = useRouter();

  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);

  const { user } = useUser();
  const { toggle, isFollowing, isPending, followStatus } = useToggleFollow(
    collaborator.uid,
  );

  const handleToggleFollow = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para seguir colaboradores");
      return;
    }

    const result = await toggle();

    if (result.status === "success") {
      toast.success(
        isFollowing ? "Dejaste de seguir" : "Ahora sigues a este colaborador",
      );
    } else if (result.status === "business-error") {
      toast.error(result.message);
    }
  };

  return (
    <SectionImg>
      <Card
        className="container max-w-7xl bg-card/30 mx-auto flex flex-col gap-4"
        size="3"
      >
        {/* Header */}
        <Flex
          gap="5"
          align="center"
          justify={{ initial: "center", sm: "start" }}
          wrap="wrap"
        >
          <Avatar
            src={collaborator.foto || ""}
            fallback={collaborator.nombre.charAt(0)}
            size="7"
            radius="full"
          />

          <Flex direction="column" gap="1">
            <Heading as="h1" className="text-4xl">
              {collaborator.nombre} {collaborator.apellido}
            </Heading>

            <Text as="p" className="text-muted-foreground">
              "{collaborator.descripcion}"
            </Text>
          </Flex>
        </Flex>

        {/* Action Buttons */}
        <Flex gap="3" wrap="wrap" hidden={collaborator.uid === user?.uid}>
          <Button
            className="w-full md:flex-1"
            variant={isFollowing ? "solid" : "soft"}
            onClick={() => handleToggleFollow()}
            loading={isPending}
            disabled={isPending || followStatus?.status !== "success"}
          >
            <Heart
              size={16}
              className={`${isFollowing ? "fill-current" : ""}`}
            />
            {isFollowing ? "Siguiendo" : "Seguir"}
          </Button>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft" className="w-full md:flex-1">
                <Diamond size={16} /> Enviar Joyas
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>Comprar Joyas</Dialog.Title>

              <Dialog.Description size="2" mb="4">
                Apoya a {escort?.name} enviándole joyas.
              </Dialog.Description>

              <PayPalPayment />

              <Flex mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft">Cerrar</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          <Button
            className="bg-primary w-full md:flex-1"
            onClick={() => router.push(`/chats/${escort?.id}`)}
          >
            <MessageCircle size={16} /> Enviar Mensaje
          </Button>
        </Flex>

        <Separator size="4" />

        {/* About Section */}
        <Flex direction="column" gap="2">
          <Heading as="h2" size="4">
            Sobre {collaborator.nombre}
          </Heading>

          <Text as="p">{collaborator.descripcion}</Text>

          <Flex gap="4" mt="2">
            <Text>
              <strong>Edad:</strong> {collaborator.edad}
            </Text>

            <Text>
              <strong>Ubicación:</strong> {collaborator.direccion?.pais}{" "}
              {collaborator.direccion?.estado_region}{" "}
              {collaborator.direccion?.ciudad_localidad}
            </Text>
          </Flex>
        </Flex>

        <Separator size="4" />
        <PostCarousel id={collaborator.uid} />
        <Separator size="4" />

        {/* Rating Section */}
        <Flex direction="column" gap="2">
          <Heading as="h2" size="4">
            Calificación
          </Heading>
          <Flex align="center" gap="2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 cursor-pointer ${
                  (hoverRating || rating) >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-500"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
            <Text weight="bold">({rating.toFixed(1)} de 5)</Text>
          </Flex>
          <Text as="p" size="2" className="text-muted-foreground">
            Deja tu calificación para ayudar a otros.
          </Text>
        </Flex>

        <Separator my="3" size="4" />

        {/* Comments Section */}
        <Comments collaboratorId={collaborator.uid} />
      </Card>
    </SectionImg>
  );
}
