"use client";

import { escorts } from "@/lib/data";
import { Flex, Button, Dialog } from "@radix-ui/themes";
import { MessageCircle, Diamond, Heart } from "lucide-react";
import PayPalPayment from "@/components/pay-pal";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { Collaborator } from "@/types/collaborator";
import { useToggleFollow } from "@/hooks/useFollow";
import { useUser } from "@/context/user-context";

export default function ProfileActions({
  collaborator,
}: {
  collaborator: Collaborator;
}) {
  const escort = escorts[0];
  const router = useRouter();

  const { user } = useUser();
  const { toggle, isFollowing, isPending } = useToggleFollow(collaborator.uid);

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
        className="bg-primary w-full md:flex-1"
        onClick={() => router.push(`/chats/${escort?.id}`)}
      >
        <MessageCircle size={16} /> Enviar Mensaje
      </Button>
    </Flex>
  );
}
