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
  TextArea,
  Dialog,
} from "@radix-ui/themes";
import { Separator } from "@radix-ui/themes/components/separator";
import { Star, MessageCircle, Diamond, Heart } from "lucide-react";
import { useState } from "react";

import PayPalPayment from "@/components/pay-pal";
import SectionImg from "@/components/section-img";

import { Collaborator } from "@/types/collaborator";
import PostCarousel from "./posts/post-carousel";

const initialComments = [
  {
    user: "Usuario123",
    time: "Hace 2 días",
    text: "Una experiencia increíble, muy recomendada. Profesional y amable.",
  },
  {
    user: "OtroUsuario",
    time: "Hace 1 semana",
    text: "Excelente compañía para eventos.",
  },
];

export default function ProfileDetail({
  collaborator,
}: {
  collaborator: Collaborator;
}) {
  // const escort = escorts.find((e) => e.id === params.id);
  const escort = escorts[0];
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);

  const handlePostComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        { user: "Tú", time: "Ahora mismo", text: newComment },
      ]);
      setNewComment("");
    }
  };

  return (
    <SectionImg>
      <Card
        className="container max-w-7xl bg-card/30 mx-auto flex flex-col gap-4"
        size="3"
      >
        {/* Header */}
        <Flex gap="5" align="center">
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
        <Flex gap="3">
          <Button
            className="flex-1 bg-primary"
            onClick={() => router.push(`/chats/${escort?.id}`)}
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Enviar Mensaje
          </Button>

          <Button
            variant={isFollowing ? "solid" : "soft"}
            className="flex-1"
            onClick={() => setIsFollowing(!isFollowing)}
          >
            <Heart
              className={`mr-2 h-4 w-4 ${isFollowing ? "fill-current" : ""}`}
            />{" "}
            {isFollowing ? "Siguiendo" : "Seguir"}
          </Button>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft" className="flex-1">
                <Diamond className="mr-2 h-4 w-4" /> Enviar Joyas
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
        <Flex direction="column" gap="3">
          <Heading as="h2" size="4">
            Comentarios Públicos
          </Heading>
          <Flex direction="column" gap="3">
            {comments.map((comment, index) => (
              <Card key={index}>
                <Flex direction="column" gap="1">
                  <Text weight="bold">{comment.user}</Text>
                  <Text size="2" className="text-muted-foreground">
                    {comment.time}
                  </Text>
                  <Text as="p" mt="2">
                    {comment.text}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Flex>

          <Flex direction="column" gap="2" mt="4">
            <TextArea
              placeholder="Escribe tu comentario público aquí..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button className="self-end" onClick={handlePostComment}>
              Publicar Comentario
            </Button>
          </Flex>
        </Flex>
      </Card>
    </SectionImg>
  );
}
