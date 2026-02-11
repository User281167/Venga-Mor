"use client";

import { Flex, Button, Dialog } from "@radix-ui/themes";
import { MessageCircle, Diamond, Heart } from "lucide-react";
import PayPalPayment from "@/components/pay-pal";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { Collaborator } from "@/types/collaborator";
import { useToggleFollow } from "@/hooks/useFollow";
import { useUser } from "@/context/user-context";
import { ChatService } from "@/services/chat";
import { useState } from "react";

export default function ProfileActions({
  collaborator,
}: {
  collaborator: Collaborator;
}) {
  const router = useRouter();

  const { user } = useUser();
  const { toggle, isFollowing, isPending } = useToggleFollow(collaborator.uid);

  const [loading, setLoading] = useState(false);

  const handleToggleFollow = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para seguir colaboradores");
      return;
    }

    const result = await toggle();

    if (!result) {
      toast.error("Error al seguir colaborador");
    }
  };

  const handleSendMessage = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para enviar mensajes");
      return;
    }

    setLoading(true);

    try {
      // Crear u obtener el chat
      const chatId = await ChatService.getOrCreateChat(
        user.uid,
        {
          displayName: user.nombre + " " + user.apellido,
          photoURL: user.foto ?? null,
        },
        collaborator.uid,
        {
          displayName: collaborator.nombre + " " + collaborator.apellido,
          photoURL: collaborator.foto ?? null,
        },
      );

      // Redirigir a la página del chat
      router.push(`/chats/${chatId}`);
    } catch (error) {
      toast.error("Error al crear chat");
      console.error("Error al crear el chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex gap="3" wrap="wrap" hidden={collaborator.uid === user?.uid}>
      <Button
        className="w-full md:flex-1"
        variant={isFollowing ? "solid" : "soft"}
        onClick={() => handleToggleFollow()}
        loading={isPending}
        disabled={isPending}
      >
        <Heart size={16} className={`${isFollowing ? "fill-current" : ""}`} />
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

      <Button
        className="bg-primary w-full md:flex-1 text-primary-foreground"
        onClick={handleSendMessage}
        loading={loading}
        disabled={loading}
      >
        <MessageCircle size={16} /> Enviar Mensaje
      </Button>
    </Flex>
  );
}
