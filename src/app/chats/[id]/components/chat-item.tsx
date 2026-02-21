"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import React, { forwardRef, memo } from "react";
import { Reply } from "lucide-react";
import { Message } from "@/types/chat.type";
import { AudioMessage } from "./audio-message";
import { formatMessageDate } from "@/utils/formatDate";
import { MediaContent } from "./media-content";
import { ReplyPreview } from "./reply-message";

interface Props {
  msg: Message;
  isMyMessage: boolean;
  onReply: (msg: Message) => void;
  onClickReply?: (id: string) => void;
}

const ChatItemComponent = forwardRef<HTMLDivElement, Props>(
  ({ msg, isMyMessage, onReply, onClickReply }, ref) => {
    const date = formatMessageDate(msg.timestamp);

    return (
      <div
        ref={ref}
        className={`flex flex-col rounded-md ${isMyMessage ? "items-end" : "items-start"}`}
      >
        {/* Reply preview */}
        {msg.replyTo && (
          <ReplyPreview
            replyTo={msg.replyTo}
            isMyMessage={isMyMessage}
            onClickReply={onClickReply}
          />
        )}

        {/* Burbuja principal */}
        <Flex
          direction="column"
          gap="3"
          className="rounded-lg w-full max-w-[80%]"
        >
          <MediaContent msg={msg} />

          <Flex
            justify="between"
            align="center"
            gap="3"
            className={`p-3 rounded-lg ${
              isMyMessage
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-white"
            }`}
          >
            {msg.type === "audio" && msg.mediaUrl ? (
              <AudioMessage
                src={msg.mediaUrl}
                isMyMessage={isMyMessage}
                audioId={msg.id}
              />
            ) : (
              <Text>{msg.text}</Text>
            )}

            <Button
              variant="ghost"
              size="1"
              className="shrink-0"
              onClick={() => onReply(msg)}
            >
              <Reply
                className={`h-4 w-4 ${isMyMessage ? "text-primary-foreground" : "text-white"}`}
              />
            </Button>
          </Flex>
        </Flex>

        {/* Timestamp + estado */}
        <Text size="1" className="text-muted-foreground mt-1">
          {date}
          {isMyMessage && msg.status === "read" && " · Leído"}
        </Text>
      </div>
    );
  },
);

ChatItemComponent.displayName = "ChatItem";

export const ChatItem = memo(ChatItemComponent, (prev, next) => {
  return prev.msg === next.msg && prev.isMyMessage === next.isMyMessage;
});
