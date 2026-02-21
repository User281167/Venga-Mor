"use client";

import { Card, Flex, Text, TextField, Button, Popover } from "@radix-ui/themes";
import {
  Send,
  CircleX,
  HardDrive,
  Image,
  Video,
  AudioLinesIcon,
} from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { Message } from "@/types/chat.type";
import { RefObject } from "react";
import { AudioMessage } from "./audio-message";

interface ChatInputProps {
  message: string;
  setMessage: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSendMessageWithType: () => void;
  replyingTo: Message | null;
  setReplyingTo: (msg: Message | null) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  fileRef: RefObject<HTMLInputElement>;
  uploadingMedia: boolean;
  uploadProgress: number;
}

export function ChatInput({
  message,
  setMessage,
  handleKeyPress,
  handleSendMessageWithType,
  replyingTo,
  setReplyingTo,
  file,
  setFile,
  fileRef,
  uploadingMedia,
  uploadProgress,
}: ChatInputProps) {
  return (
    <Flex direction="column" gap="2" className="w-full">
      {/* Preview de reply */}
      {replyingTo && (
        <Card className="flex justify-between gap-4 items-center">
          <Flex direction="column" gap="2" className="w-full">
            {replyingTo.type === "image" && replyingTo.mediaUrl && (
              <img
                className="max-h-40 w-full object-cover rounded-md"
                src={replyingTo.mediaUrl}
              />
            )}

            {replyingTo.type === "video" &&
              replyingTo.mediaMetadata?.thumbnailUrl && (
                <img
                  className="max-h-40 w-full object-cover rounded-md"
                  src={replyingTo.mediaMetadata.thumbnailUrl}
                />
              )}

            {replyingTo.type === "audio" && replyingTo.mediaUrl && (
              <AudioMessage src={replyingTo.mediaUrl} isMyMessage={false} />
            )}

            <Text as="p">{replyingTo.text.slice(0, 100)}</Text>
          </Flex>

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

      {/* Preview de archivo seleccionado */}
      {file && (
        <Card className="flex justify-between items-center">
          <Text as="p">{file.name}</Text>
          <Button
            size="2"
            color="red"
            variant="ghost"
            onClick={() => setFile(null)}
          >
            <CircleX className="h-4 w-4" />
          </Button>
        </Card>
      )}

      {/* Progreso de subida */}
      {uploadingMedia && (
        <Card className="flex justify-between items-center">
          <Text as="p">Subiendo...</Text>
          <ProgressBar value={uploadProgress} />
        </Card>
      )}

      {/* Input principal */}
      <Flex p="4" gap="3" align="center" className="border-t border-border">
        <TextField.Root
          className="flex-grow"
          placeholder={replyingTo ? "Respondiendo..." : "Escribe un mensaje..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={uploadingMedia}
        />

        <Popover.Root>
          <Popover.Trigger>
            <Button disabled={uploadingMedia}>
              <HardDrive className="h-4 w-4" />
              <input
                type="file"
                ref={fileRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ display: "none" }}
              />
            </Button>
          </Popover.Trigger>

          <Popover.Content width="360px">
            <Flex direction="column" gap="3">
              <Button
                variant="outline"
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.accept = "image/*";
                    fileRef.current.click();
                  }
                }}
                disabled={uploadingMedia}
              >
                <Image className="h-4 w-4 mr-2" />
                Imagen
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.accept = "video/*";
                    fileRef.current.click();
                  }
                }}
                disabled={uploadingMedia}
              >
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.accept = "audio/*";
                    fileRef.current.click();
                  }
                }}
                disabled={uploadingMedia}
              >
                <AudioLinesIcon className="h-4 w-4 mr-2" />
                Audio
              </Button>
            </Flex>
          </Popover.Content>
        </Popover.Root>

        <Button
          onClick={handleSendMessageWithType}
          disabled={(!message.trim() && !file) || uploadingMedia}
        >
          <Send className="h-4 w-4" />
        </Button>
      </Flex>
    </Flex>
  );
}
