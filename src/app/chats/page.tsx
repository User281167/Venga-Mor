"use client";
import { MessageSquare } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, Card, Flex, Heading, Section, Text } from "@radix-ui/themes";
import Link from "next/link";
import { escorts } from "@/lib/data";
import SectionImg from "@/components/section-img";

export default function ChatsPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "chat-bg");

  // Use escorts data for a more dynamic feel
  const chatContacts = escorts.slice(0, 4).map((escort) => {
    const profileImage = PlaceHolderImages.find((p) => p.id === escort.imageId);
    return {
      id: escort.id,
      name: escort.name,
      lastMessage: "Toca para iniciar una conversación...",
      time: "Ahora",
      avatar: profileImage?.imageUrl || "",
    };
  });

  return (
    <SectionImg
      imageUrl={bgImage?.imageUrl}
      alt={bgImage?.description}
      imageHint={bgImage?.imageHint}
    >
      <div className="flex flex-col w-11/12 max-w-2xl gap-4 mx-auto">
        <Heading className="text-4xl font-bold text-primary mb-8 text-center">
          Chats
        </Heading>

        {chatContacts.length > 0 ? (
          <div className="space-y-4">
            {chatContacts.map((contact) => (
              <Link href={`/chats/${contact.id}`} key={contact.id}>
                <Card className="bg-card/80 hover:bg-card/90 cursor-pointer transition-colors">
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
              </Link>
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
    </SectionImg>
  );
}
