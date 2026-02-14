"use client";

import { AspectRatio, Button, Dialog, Flex, Text } from "@radix-ui/themes";
import React, { forwardRef, memo } from "react";

import { Play, Reply, XIcon } from "lucide-react";
import { Message } from "@/types/chat.type";

interface Props {
  msg: Message;
  isMyMessage: boolean;
  onReply: (msg: Message) => void;
  onClickReply?: (id: string) => void;
}

const ChatItemComponent = forwardRef<HTMLDivElement, Props>(
  ({ msg, isMyMessage, onReply, onClickReply }, ref) => {
    const isToday =
      new Date().toDateString() === new Date(msg.timestamp).toDateString();

    let date = new Date(msg.timestamp).toLocaleDateString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      date =
        "Hoy: " +
        new Date(msg.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
    }

    return (
      <div
        className={`flex flex-col rounded-md ${isMyMessage ? "items-end" : "items-start"}`}
        ref={ref}
      >
        {msg.replyTo && (
          <button
            onClick={() => onClickReply?.(msg.replyTo!.messageId)}
            className={`p-2 rounded-md text-xs bg-muted hover:bg-primary/40 cursor-pointer max-w-[80%] flex flex-col gap-2 w-full transition-colors ${
              isMyMessage ? "text-right" : "text-left"
            }`}
          >
            <Text size="1" className="text-muted-foreground">
              Respondiendo a
            </Text>

            {msg.replyTo.type === "image" && msg.replyTo.mediaUrl && (
              <AspectRatio ratio={16 / 8}>
                <img
                  src={msg.replyTo.mediaUrl}
                  className="w-full h-full object-cover rounded-md"
                />
              </AspectRatio>
            )}

            {msg.replyTo.type === "video" && msg.replyTo.thumbnailUrl && (
              <AspectRatio ratio={16 / 8} className="Relative">
                <img
                  src={msg.replyTo.thumbnailUrl}
                  className="w-full h-full object-cover rounded-md"
                />

                <div className="absolute inset-0 w-full h-full bg-black/50" />
              </AspectRatio>
            )}

            {msg.replyTo.type === "audio" && msg.replyTo.mediaUrl && (
              <audio src={msg.replyTo.mediaUrl} className="w-full" controls />
            )}

            <Text size="1" className="truncate block">
              {msg.replyTo.text}
            </Text>
          </button>
        )}

        {/* Mensaje principal */}
        <Flex
          direction="column"
          justify="between"
          gap="3"
          className="rounded-lg w-full max-w-[80%]"
        >
          {msg.type === "audio" && msg.mediaUrl && (
            <audio src={msg.mediaUrl} className="w-full" controls />
          )}

          <Dialog.Root>
            <Dialog.Trigger>
              <div className="w-full cursor-pointer" key={msg.id}>
                {msg.type === "image" && msg.mediaUrl && (
                  <AspectRatio ratio={1 / 1}>
                    <img
                      src={msg.mediaUrl}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </AspectRatio>
                )}

                {msg.type === "video" && msg.mediaMetadata?.thumbnailUrl && (
                  <AspectRatio ratio={1 / 1} className="relative">
                    <img
                      src={msg.mediaMetadata.thumbnailUrl}
                      className="w-full h-full object-cover rounded-md"
                    />

                    <div className="absolute inset-0 w-full h-full bg-black/50" />

                    <Play
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                      size={64}
                    />
                  </AspectRatio>
                )}
              </div>
            </Dialog.Trigger>

            <Dialog.Content
              aria-describedby="posts-carousel-description"
              className="
                  fixed inset-0 z-50
                  h-[90vh] w-full md:max-w-4xl xl:max-w-7xl
                  flex items-center justify-center
                  outline-none
                  bg-stone-900
                  overflow-hidden
                "
            >
              <Dialog.Title className="sr-only">
                {msg.mediaMetadata?.fileName}
              </Dialog.Title>

              <Dialog.Close className="absolute top-4 right-4">
                <Button variant="ghost" size="4" className="z-10">
                  <XIcon />
                </Button>
              </Dialog.Close>

              <Flex
                direction="column"
                align="center"
                justify="center"
                gap="4"
                className="w-full h-full"
                mt="6"
              >
                {msg.type === "image" && msg.mediaUrl && (
                  <img
                    src={msg.mediaUrl}
                    className="w-full max-h-[80vh] object-contain"
                  />
                )}

                {msg.type === "video" && msg.mediaUrl && (
                  <video
                    src={msg.mediaUrl}
                    controls
                    className="w-full max-h-[80vh] object-contain"
                  />
                )}
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

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
        </Flex>

        <Text size="1" className="text-muted-foreground mt-1">
          {date}
          {isMyMessage && msg.status === "read" && " · Leído"}
        </Text>
      </div>
    );
  },
);

export const ChatItem = memo(ChatItemComponent, (prev, next) => {
  return prev.msg === next.msg && prev.isMyMessage === next.isMyMessage;
});
