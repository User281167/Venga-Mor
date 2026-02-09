"use client";

import {
  Avatar,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  Section,
} from "@radix-ui/themes";
import { Send, ArrowLeft } from "lucide-react";
import SectionImg from "@/components/section-img";
import { PlaceHolderImages } from "@/lib/placeholder-images";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import { ChatService } from "@/services/chat";
import { PresenceService } from "@/services/presence";

import { useUser } from "@/context/user-context";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  status: "sent" | "read";
}

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const chatId = params?.id;

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [otherUserStatus, setOtherUserStatus] = useState<"online" | "offline">(
    "offline",
  );

  // Scroll automático al final
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cargar info del chat y mensajes
  useEffect(() => {
    if (!user?.uid || !chatId) return;

    const loadChat = async () => {
      try {
        // Obtener info del chat (otherUser, etc)
        const info = await ChatService.getChatInfo(chatId, user.uid);

        if (!info) {
          router.push("/chats");
          return;
        }

        setChatInfo(info);

        // Suscribirse a mensajes
        const unsubscribeMessages = ChatService.subscribeToMessages(
          chatId,
          setMessages,
        );

        // Marcar mensajes como leídos
        ChatService.markMessagesAsRead(chatId, user.uid);

        // Suscribirse al estado del otro usuario
        const otherUserId = Object.keys(info.participants).find(
          (id) => id !== user.uid,
        );

        if (otherUserId) {
          const unsubscribePresence = PresenceService.subscribeToUserStatus(
            otherUserId,
            setOtherUserStatus,
          );

          setLoading(false);

          return () => {
            unsubscribeMessages();
            unsubscribePresence();
          };
        }

        setLoading(false);
        return () => unsubscribeMessages();
      } catch (error) {
        console.error("Error loading chat:", error);
        router.push("/chats");
      }
    };

    loadChat();
  }, [user, chatId, router]);

  const handleSend = async () => {
    if (!message.trim() || !user || !chatId || !chatInfo) return;

    const otherUserId = Object.keys(chatInfo.participants).find(
      (id) => id !== user.uid,
    );

    if (!otherUserId) return;

    try {
      await ChatService.sendMessage(
        chatId,
        user.uid,
        `${user.nombre} ${user.apellido}`,
        otherUserId,
        message,
      );

      setMessage("");
    } catch (error) {
      toast.error("Error al enviar el mensaje");
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <Section className="py-8 px-4 h-[calc(100vh-80px)] flex items-center justify-center">
        <Text>Cargando chat...</Text>
      </Section>
    );
  }

  if (!chatInfo || !chatInfo.otherUser) {
    return (
      <Section className="py-8 px-4 h-[calc(100vh-80px)] flex items-center justify-center">
        <Text>Chat no encontrado</Text>
      </Section>
    );
  }

  const { otherUser } = chatInfo;
  const bgImage = PlaceHolderImages.find((p) => p.id === "chat-bg");

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
            src={otherUser.photoURL || undefined}
            fallback={otherUser.displayName.charAt(0).toUpperCase()}
            size="3"
            radius="full"
          />

          <div className="flex-grow">
            <Heading as="h1" className="text-xl">
              {otherUser.displayName}
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
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isMyMessage ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      isMyMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <Text>{msg.text}</Text>
                  </div>
                  <Text size="1" className="text-muted-foreground mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isMyMessage && msg.status === "read" && " · Leído"}
                  </Text>
                </div>
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
