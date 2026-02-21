"use client";

import { Avatar, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChatInfo } from "@/types/chat.type";

interface ChatHeaderProps {
  chatInfo: ChatInfo;
  otherUserStatus: string;
}

export function ChatHeader({ chatInfo, otherUserStatus }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <Flex p="4" align="center" gap="4" className="border-b border-border">
      <Button variant="ghost" size="2" onClick={() => router.push("/chats")}>
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <Avatar
        src={chatInfo.otherUser?.photoURL || undefined}
        fallback={chatInfo.otherUser?.displayName.charAt(0).toUpperCase() || ""}
        size="3"
        radius="full"
      />

      <div className="flex-grow">
        <Heading as="h1" className="text-xl">
          {chatInfo.otherUser?.displayName}
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
  );
}
