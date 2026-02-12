"use client";

import {
  Avatar,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  Spinner,
} from "@radix-ui/themes";
import { Send, ArrowLeft, CircleX } from "lucide-react";
import SectionImg from "@/components/section-img";
import { PlaceHolderImages } from "@/lib/placeholder-images";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import { useUser } from "@/context/user-context";
import { useChat } from "./chat-message.hook";
import { ChatItem } from "./chat-item";
import { toast } from "sonner";
import { Message } from "@/types/chat.type";

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
    replyingTo,
    setReplyingTo,
    hasMore,
    loadingOlder,
    loadMoreTriggerRef,
    messagesContainerRef,
    shouldScrollToBottom,
  } = useChat(params.id);

  const bgImage = PlaceHolderImages.find((p) => p.id === "chat-bg");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // SCROLL INTELIGENTE - Solo cuando shouldScrollToBottom es true
  useEffect(() => {
    if (shouldScrollToBottom) {
      // Usar scrollIntoView sin smooth para evitar conflictos
      chatEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, shouldScrollToBottom]);

  const handleReply = useCallback(
    (msg: Message) => {
      setReplyingTo(msg);
    },
    [setReplyingTo],
  );

  const handleScrollToMessage = useCallback((messageId: string) => {
    const messageElement = messageRefs.current.get(messageId);

    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      // Highlight temporal
      messageElement.classList.add("bg-accent/30");

      setTimeout(() => {
        messageElement.classList.remove("bg-accent/30");
      }, 2000);
    }
  }, []);

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
        <Spinner />
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
          ref={messagesContainerRef}
          direction="column"
          gap="3"
          className="p-4 flex-grow overflow-y-auto"
        >
          {/* Trigger para cargar más (invisible) */}
          {hasMore && messages.length > 0 && (
            <div ref={loadMoreTriggerRef} className="h-1" />
          )}

          {/* Indicador de carga */}
          {loadingOlder && (
            <Flex justify="center" py="2">
              <Spinner size="2" />
            </Flex>
          )}

          {/* Mensaje de "inicio de chat" */}
          {!hasMore && messages.length > 0 && (
            <Flex justify="center" py="3">
              <Text size="1" className="text-muted-foreground">
                🎉 Inicio de la conversación
              </Text>
            </Flex>
          )}

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
                <ChatItem
                  ref={(el) => {
                    if (el) {
                      messageRefs.current.set(msg.id, el);
                    } else {
                      messageRefs.current.delete(msg.id);
                    }
                  }}
                  key={msg.id}
                  msg={msg}
                  isMyMessage={isMyMessage}
                  onReply={handleReply}
                  onClickReply={handleScrollToMessage}
                />
              );
            })
          )}

          <div ref={chatEndRef} />
        </Flex>

        {/* Input de Mensaje */}
        <Flex direction="column" gap="2">
          {replyingTo && (
            <Card className="flex justify-between items-center">
              <Text as="p">{replyingTo.text.slice(0, 100)}</Text>

              <Button
                size="2"
                color="red"
                variant="ghost"
                onClick={() => setReplyingTo(null)}
              >
                <CircleX className="h-4 w-4" />
              </Button>
            </Card>
          )}

          <Flex p="4" gap="3" align="center" className="border-t border-border">
            <TextField.Root
              className="flex-grow"
              placeholder={
                replyingTo ? `Respondiendo...` : "Escribe un mensaje..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <Button onClick={handleSend} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </Flex>
        </Flex>
      </Card>
    </SectionImg>
  );
}
