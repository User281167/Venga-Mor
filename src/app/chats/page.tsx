"use client";

import { Avatar, Card, Flex, Heading, Text } from "@radix-ui/themes";
import SectionImg from "@/components/section-img";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";

import { useUser } from "@/context/user-context";
import { ChatService } from "@/services/chat";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface ChatInfo {
  chatId: string;
  otherUser: {
    displayName: string;
    photoURL: string;
  } | null;
  lastMessage: {
    text: string;
    senderId: string;
    senderName: string;
    timestamp: number;
  } | null;
}

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.uid) return;

    // LISTENER - ya trae toda la info del chat
    const unsubscribe = ChatService.getUserChats(user.uid, (userChats) => {
      setChats(userChats);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user?.uid) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Text>Cargando...</Text>
      </div>
    );
  }

  const bgImage = PlaceHolderImages.find((p) => p.id === "chat-bg");

  return (
    <SectionImg
      imageUrl={bgImage?.imageUrl}
      alt={bgImage?.description}
      imageHint={bgImage?.imageHint}
    >
      <Heading className="text-4xl font-bold text-primary mb-8 text-center">
        Chats
      </Heading>

      {chats.length > 0 ? (
        <div className="space-y-4 w-full max-w-2xl">
          {chats.map((chat) => {
            const { chatId, otherUser, lastMessage } = chat;

            if (!otherUser) return null;

            return (
              <Link href={`/chats/${chatId}`} key={chatId}>
                <Card className="bg-card/80 hover:bg-card/90 cursor-pointer transition-colors">
                  <Flex p="4" align="center" gap="4">
                    <Avatar
                      className="h-12 w-12"
                      src={otherUser.photoURL || undefined}
                      alt={otherUser.displayName}
                      fallback={otherUser.displayName.charAt(0).toUpperCase()}
                    />
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <Heading
                          as="h3"
                          className="font-semibold text-lg truncate"
                        >
                          {otherUser.displayName}
                        </Heading>
                        {lastMessage && (
                          <Text
                            as="p"
                            className="text-xs text-muted-foreground shrink-0"
                          >
                            {new Date(lastMessage.timestamp).toLocaleTimeString(
                              "es-ES",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </Text>
                        )}
                      </div>
                      <Text
                        as="p"
                        className="text-sm text-muted-foreground truncate"
                      >
                        {lastMessage ? (
                          <>
                            {lastMessage.senderId === user.uid && (
                              <span className="font-medium">Tú: </span>
                            )}
                            {lastMessage.text}
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
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <Heading
            as="h2"
            className="mt-4 text-xl font-semibold text-foreground"
          >
            No tienes chats
          </Heading>
          <Text as="p" className="mt-2 text-muted-foreground">
            Inicia una conversación para ver tus chats.
          </Text>
        </div>
      )}
    </SectionImg>
  );
}
