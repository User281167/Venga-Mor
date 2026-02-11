"use client";

import {
  Avatar,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
} from "@radix-ui/themes";
import { Send, ArrowLeft } from "lucide-react";
import SectionImg from "@/components/section-img";
import { PlaceHolderImages } from "@/lib/placeholder-images";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import { useUser } from "@/context/user-context";
import { useChat } from "./chat-message.hook";
import { ChatItem } from "./chat-item";
import { toast } from "sonner";

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { user } = useUser();
  const {
    loading,
    chatInfo,
    otherUserStatus,
    messages,
    message,
    setMessage,
    chatNotFound,
    chatError,
    handleKeyPress,
    handleSend,
    errorMessage,
  } = useChat(params.id);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const bgImage = PlaceHolderImages.find((p) => p.id === "chat-bg");

  if (errorMessage) {
    toast.error(errorMessage);
  }

  if (loading) {
    return (
      <SectionImg
        imageUrl={bgImage?.imageUrl}
        alt={bgImage?.description}
        imageHint={bgImage?.imageHint}
      >
        <Text>Cargando chat...</Text>
      </SectionImg>
    );
  }

  if (chatError) {
    return (
      <SectionImg
        imageUrl={bgImage?.imageUrl}
        alt={bgImage?.description}
        imageHint={bgImage?.imageHint}
      >
        <Text>Error al cargar el chat</Text>
      </SectionImg>
    );
  }

  if (chatNotFound || !chatInfo || !chatInfo.otherUser) {
    return (
      <SectionImg
        imageUrl={bgImage?.imageUrl}
        alt={bgImage?.description}
        imageHint={bgImage?.imageHint}
      >
        <Text>Chat no encontrado</Text>
      </SectionImg>
    );
  }

  return (
    <SectionImg
      imageUrl={bgImage?.imageUrl}
      alt={bgImage?.description}
      imageHint={bgImage?.imageHint}
    >
      <Card className="max-w-2xl w-full mx-auto bg-card/50 flex-grow flex flex-col max-h-[90vh]">
        {/* Header del Chat */}
        <Flex p="4" align="center" gap="4" className="border-b border-border">
          <Button
            variant="ghost"
            size="2"
            onClick={() => router.push("/chats")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar
            src={chatInfo.otherUser.photoURL || undefined}
            fallback={chatInfo.otherUser.displayName.charAt(0).toUpperCase()}
            size="3"
            radius="full"
          />

          <div className="flex-grow">
            <Heading as="h1" className="text-xl">
              {chatInfo.otherUser.displayName}
            </Heading>
            <Text size="1" className="text-muted-foreground">
              {otherUserStatus === "online" ? (
                <span className="text-green-500">● En línea</span>
              ) : (
                <span className="text-gray-400">● Desconectado</span>
              )}
            </Text>
          </div>
        </Flex>

        {/* Mensajes */}
        <Flex
          direction="column"
          gap="3"
          className="p-4 flex-grow overflow-y-auto"
        >
          {messages.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <Text className="text-muted-foreground text-center">
                No hay mensajes aún.
                <br />
                Inicia la conversación 👋
              </Text>
            </div>
          ) : (
            messages.map((msg) => {
              const isMyMessage = msg.senderId === user?.uid;

              return (
                <ChatItem key={msg.id} msg={msg} isMyMessage={isMyMessage} />
              );
            })
          )}

          <div ref={chatEndRef} />
        </Flex>

        {/* Input de Mensaje */}
        <Flex p="4" gap="3" align="center" className="border-t border-border">
          <TextField.Root
            className="flex-grow"
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSend} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </Flex>
      </Card>
    </SectionImg>
  );
}
