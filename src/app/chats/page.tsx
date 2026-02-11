"use client";

import { Box, Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import SectionImg from "@/components/section-img";
import { MessageSquare } from "lucide-react";
import ChatLink from "./chat-link";

import { useEffect, useMemo, useState } from "react";

import { useUser } from "@/context/user-context";
import { ChatService } from "@/services/chat";
import { PlaceHolderImages } from "@/lib/placeholder-images";

import { ChatInfo } from "./chatInfo";

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

  const bgImage = PlaceHolderImages.find((p) => p.id === "chat-bg");
  const skeletons = useMemo(() => Array.from({ length: 4 }), []);

  if (!user?.uid) {
    return (
      <SectionImg
        imageUrl={bgImage?.imageUrl}
        alt={bgImage?.description}
        imageHint={bgImage?.imageHint}
      >
        <Heading className="text-4xl font-bold text-primary mb-8 text-center">
          Chats
        </Heading>

        <Text>Cargando...</Text>

        <Flex direction="column" gap="2" className="w-full max-w-2xl">
          {skeletons.map((_, index) => (
            <Skeleton key={index} loading={true}>
              <Box className="w-full h-24"></Box>
            </Skeleton>
          ))}
        </Flex>
      </SectionImg>
    );
  }

  if (chats.length === 0) {
    return (
      <SectionImg
        imageUrl={bgImage?.imageUrl}
        alt={bgImage?.description}
        imageHint={bgImage?.imageHint}
      >
        <Heading className="text-4xl font-bold text-primary mb-8 text-center">
          Chats
        </Heading>

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
      </SectionImg>
    );
  }

  return (
    <SectionImg
      imageUrl={bgImage?.imageUrl}
      alt={bgImage?.description}
      imageHint={bgImage?.imageHint}
    >
      <Heading className="text-4xl font-bold text-primary mb-8 text-center">
        Chats
      </Heading>

      <Flex direction="column" gap="2" className="w-full max-w-2xl">
        {chats.map((chat) => (
          <ChatLink key={chat.chatId} chatInfo={chat} userId={user.uid} />
        ))}
      </Flex>
    </SectionImg>
  );
}
