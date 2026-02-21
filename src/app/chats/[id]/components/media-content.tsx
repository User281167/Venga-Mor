"use client";

import { AspectRatio, Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { Play, XIcon } from "lucide-react";
import { Message } from "@/types/chat.type";

export function MediaContent({ msg }: { msg: Message }) {
  const hasMedia =
    (msg.type === "image" && msg.mediaUrl) ||
    (msg.type === "video" && msg.mediaMetadata?.thumbnailUrl);

  if (!hasMedia) return null;

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <div className="w-full cursor-pointer">
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

              <div className="absolute inset-0 bg-black/50" />

              <Play
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                size={64}
              />
            </AspectRatio>
          )}
        </div>
      </Dialog.Trigger>

      <Dialog.Content
        aria-describedby="media-viewer"
        className="fixed inset-0 z-50 h-[90vh] w-full md:max-w-4xl xl:max-w-7xl flex items-center justify-center outline-none bg-stone-900 overflow-hidden"
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
  );
}
