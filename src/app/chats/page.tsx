
'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const chatContacts = [
  { name: 'Sofia', lastMessage: "Hola! ¿Cómo estás?", time: "10:42 AM", avatar: "https://images.unsplash.com/photo-1610462679576-e591f04e6e1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx3b21hbiUyMHByb2ZpbGV8ZW58MHx8fHwxNzY1NDc2OTEzfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: 'Camila', lastMessage: "Nos vemos esta noche.", time: "Ayer", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHByb2ZpbGV8ZW58MHx8fHwxNzY1NDc2OTEzfDA&ixlib=rb-4.1.0&q=80&w=1080" },
];

export default function ChatsPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'chat-bg');

  return (
    <div className="relative min-h-[calc(100vh-128px)] -mx-4 -my-8 flex flex-col justify-center">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          layout="fill"
          objectFit="cover"
          unoptimized
          className="absolute z-0 opacity-20"
          data-ai-hint={bgImage.imageHint}
        />
      )}
      <div className="relative z-10 p-4">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">Chats</h1>
        {chatContacts.length > 0 ? (
          <div className="space-y-4">
            {chatContacts.map((contact, index) => (
              <Card key={index} className="bg-card/80 hover:bg-card/90 cursor-pointer transition-colors">
                <CardContent className="p-4 flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">{contact.name}</h3>
                      <p className="text-xs text-muted-foreground">{contact.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-white">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">No tienes chats</h2>
            <p className="mt-2 text-muted-foreground">Inicia una conversación para ver tus chats.</p>
          </div>
        )}
      </div>
    </div>
  );
}
