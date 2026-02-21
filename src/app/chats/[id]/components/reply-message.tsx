"use client";
import { Message } from "@/types/chat.type";
import { AspectRatio, Text } from "@radix-ui/themes";
import { AudioMessage } from "./audio-message";

interface Props {
  replyTo: NonNullable<Message["replyTo"]>;
  isMyMessage: boolean;
  onClickReply?: (id: string) => void;
}

export function ReplyPreview({ replyTo, isMyMessage, onClickReply }: Props) {
  return (
    <div
      onClick={() => {
        if (replyTo.type !== "audio") {
          onClickReply?.(replyTo.messageId);
        }
      }}
      className={`
        p-2 rounded-md text-xs bg-muted hover:bg-primary/40
        max-w-[80%] flex flex-col gap-2 w-full
        transition-colors
        ${isMyMessage ? "text-right" : "text-left"}
        ${replyTo.type !== "audio" ? "cursor-pointer" : "cursor-default"}
      `}
    >
      <Text
        size="1"
        className="text-muted-foreground cursor-pointer"
        onClick={() => {
          if (replyTo.type === "audio") {
            onClickReply?.(replyTo.messageId);
          }
        }}
      >
        Respondiendo a
      </Text>

      {replyTo.type === "image" && replyTo.mediaUrl && (
        <AspectRatio ratio={16 / 8}>
          <img
            src={replyTo.mediaUrl}
            className="w-full h-full object-cover rounded-md"
          />
        </AspectRatio>
      )}

      {replyTo.type === "video" && replyTo.thumbnailUrl && (
        <AspectRatio ratio={16 / 8} className="relative">
          <img
            src={replyTo.thumbnailUrl}
            className="w-full h-full object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black/50" />
        </AspectRatio>
      )}

      {replyTo.type === "audio" && replyTo.mediaUrl && (
        <AudioMessage isMyMessage={false} src={replyTo.mediaUrl} />
      )}

      <Text size="1" className="truncate block">
        {replyTo.text}
      </Text>
    </div>
  );
}
