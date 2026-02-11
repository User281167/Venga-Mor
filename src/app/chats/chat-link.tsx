import React from "react";
import Link from "next/link";
import { Card, Flex, Avatar, Heading, Text } from "@radix-ui/themes";
import { ChatInfo } from "./chatInfo";

interface ChatLinkProps {
  chatInfo: ChatInfo;
  userId: string;
}

const ChatLink = React.memo(({ chatInfo, userId }: ChatLinkProps) => {
  if (!chatInfo.otherUser) return null;

  return (
    <Link href={`/chats/${chatInfo.chatId}`} key={chatInfo.chatId}>
      <Card className="bg-card/80 hover:bg-card/90 cursor-pointer transition-colors p-0">
        <Flex p="4" align="center" gap="4">
          <Avatar
            className="h-12 w-12"
            src={chatInfo.otherUser.photoURL || undefined}
            alt={chatInfo.otherUser.displayName}
            fallback={chatInfo.otherUser.displayName.charAt(0).toUpperCase()}
          />

          <div className="flex-grow min-w-0 flex flex-col gap-2">
            <div className="flex flex-col justify-between md:flex-row md:items-center md:gap-2">
              <Heading as="h3" className="font-semibold text-lg truncate">
                {chatInfo.otherUser.displayName}
              </Heading>

              {chatInfo.lastMessage && (
                <Text as="p" className="text-xs text-muted-foreground shrink-0">
                  {new Date(chatInfo.lastMessage.timestamp).toLocaleDateString(
                    "es-ES",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </Text>
              )}
            </div>

            <Text as="p" className="text-sm text-muted-foreground truncate">
              {chatInfo.lastMessage ? (
                <>
                  {chatInfo.lastMessage.senderId === userId && (
                    <span className="font-medium">Tú: </span>
                  )}
                  {chatInfo.lastMessage.text}
                </>
              ) : (
                "Toca para iniciar una conversación..."
              )}
            </Text>
          </div>
        </Flex>
      </Card>
    </Link>
  );
});

export default ChatLink;
