"use client";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, Card, Flex, Heading, Section, Text } from "@radix-ui/themes";

const chatContacts = [
  {
    name: "Sofia",
    lastMessage: "Hola! ¿Cómo estás?",
    time: "10:42 AM",
    avatar:
      "https://images.unsplash.com/photo-1610462679576-e591f04e6e1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx3b21hbiUyMHByb2ZpbGV8ZW58MHx8fHwxNzY1NDc2OTEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Camila",
    lastMessage: "Nos vemos esta noche.",
    time: "Ayer",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHByb2ZpbGV8ZW58MHx8fHwxNzY1NDc2OTEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export default function ChatsPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "chat-bg");

  return (
    <Section className="relative min-h-[calc(100vh-128px)]">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          unoptimized
          priority
          className="absolute  -z-10 h-full w-full opacity-30 object-cover object-center"
          data-ai-hint={bgImage.imageHint}
          width={1920}
          height={1080}
        />
      )}

      <div className="flex flex-col w-11/12 max-w-2xl gap-4 mx-auto">
        <Heading className="text-4xl font-bold text-primary mb-8 text-center">
          Chats
        </Heading>

        {chatContacts.length > 0 ? (
          <div className="space-y-4">
            {chatContacts.map((contact, index) => (
              <Card
                key={index}
                className="bg-card/80 hover:bg-card/90 cursor-pointer transition-colors"
              >
                <Flex p="4" align="center" gap="4">
                  <Avatar
                    className="h-12 w-12"
                    src={contact.avatar}
                    alt={contact.name}
                    fallback={contact.name.charAt(0)}
                  />

                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <Heading as="h3" className="font-semibold text-lg">
                        {contact.name}
                      </Heading>

                      <Text as="p" className="text-xs text-muted-foreground">
                        {contact.time}
                      </Text>
                    </div>

                    <Text
                      as="p"
                      className="text-sm text-muted-foreground truncate"
                    >
                      {contact.lastMessage}
                    </Text>
                  </div>
                </Flex>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-white">
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
      </div>
    </Section>
  );
}
