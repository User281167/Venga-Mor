"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import React, { forwardRef, memo } from "react";

import { Reply } from "lucide-react";
import { Message } from "@/types/chat.type";

interface Props {
  msg: Message;
  isMyMessage: boolean;
  onReply: (msg: Message) => void;
  onClickReply?: (id: string) => void;
}

const ChatItemComponent = forwardRef<HTMLDivElement, Props>(
  ({ msg, isMyMessage, onReply, onClickReply }, ref) => {
    return (
      <div
        className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}
        ref={ref}
      >
        {msg.replyTo && (
          <button
            onClick={() => onClickReply?.(msg.replyTo!.messageId)}
            className={`mb-1 px-3 py-1 rounded-md text-xs bg-muted hover:bg-muted cursor-pointer max-w-[80%] ${
              isMyMessage ? "text-right" : "text-left"
            }`}
          >
            <Text size="1" className="text-muted-foreground">
              Respondiendo a
            </Text>

            <Text size="1" className="truncate block">
              {msg.replyTo.text}
            </Text>
          </button>
        )}

        {/* Mensaje principal */}
        <Flex
          justify="between"
          align="center"
          gap="3"
          className={`p-3 rounded-lg max-w-[80%] ${
            isMyMessage ? "bg-primary text-primary-foreground" : "bg-secondary"
          }`}
        >
          <Text>{msg.text}</Text>

          <Button
            variant="ghost"
            size="1"
            onClick={() => {
              if (onReply) onReply(msg);
            }}
          >
            <Reply className="h-4 w-4" />
          </Button>
        </Flex>

        <Text size="1" className="text-muted-foreground mt-1">
          {new Date(msg.timestamp).toLocaleDateString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}

          {isMyMessage && msg.status === "read" && " · Leído"}
        </Text>
      </div>
    );
  },
);

export const ChatItem = memo(ChatItemComponent, (prev, next) => {
  return prev.msg === next.msg && prev.isMyMessage === next.isMyMessage;
});
