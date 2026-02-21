"use client";

import { Flex, Spinner, Text } from "@radix-ui/themes";
import { ChatItem } from "./chat-item";
import { Message } from "@/types/chat.type";
import { RefObject } from "react";

interface ChatMessageListProps {
  messages: Message[];
  currentUserId: string;
  hasMore: boolean;
  loadingOlder: boolean;
  loadMoreTriggerRef: RefObject<HTMLDivElement>;
  messagesContainerRef: RefObject<HTMLDivElement>;
  chatEndRef: RefObject<HTMLDivElement>;
  messageRefs: RefObject<Map<string, HTMLDivElement>>;
  onReply: (msg: Message) => void;
  onScrollToMessage: (messageId: string) => void;
}

export function ChatMessageList({
  messages,
  currentUserId,
  hasMore,
  loadingOlder,
  loadMoreTriggerRef,
  messagesContainerRef,
  chatEndRef,
  messageRefs,
  onReply,
  onScrollToMessage,
}: ChatMessageListProps) {
  return (
    <Flex
      ref={messagesContainerRef}
      direction="column"
      gap="3"
      className="p-4 flex-grow overflow-y-auto"
    >
      {hasMore && messages.length > 0 && (
        <div ref={loadMoreTriggerRef} className="h-1" />
      )}

      {loadingOlder && (
        <Flex justify="center" py="2">
          <Spinner size="2" />
        </Flex>
      )}

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
          const isMyMessage = msg.senderId === currentUserId;

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
              onReply={onReply}
              onClickReply={onScrollToMessage}
            />
          );
        })
      )}

      <div ref={chatEndRef} />
    </Flex>
  );
}
