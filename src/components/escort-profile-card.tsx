import Image from "next/image";
import type { Escort } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Star, MapPin, Diamond } from "lucide-react";
import { Badge, Button, Card, Flex } from "@radix-ui/themes";
import Link from "next/link";

interface EscortProfileCardProps {
  escort: Escort;
}

export function EscortProfileCard({ escort }: EscortProfileCardProps) {
  const profileImage = PlaceHolderImages.find((p) => p.id === escort.imageId);

  return (
    <Card className="bg-card/80 overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 w-full hover:scale-[1.02]">
      <Flex direction="column" gap="4">
        <div className="flex space-x-4">
          {profileImage && (
            <Image
              src={profileImage.imageUrl}
              alt={escort.name}
              width={100}
              height={100}
              className="rounded-lg object-cover w-24 h-24 border-2 border-primary"
              data-ai-hint={profileImage.imageHint}
            />
          )}

          <div className="flex-grow">
            <h3 className="text-xl font-bold text-accent font-headline">
              {escort.name}
            </h3>

            <p className="text-muted-foreground text-sm mt-1 italic">
              "{escort.phrase}"
            </p>

            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="solid">Idiomas</Badge>
              <Badge variant="soft">Cultura</Badge>
              <Badge variant="soft">Virtual</Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-1 text-yellow-400">
            <Star className="h-5 w-5 fill-current" />
            <span className="font-bold text-white">4.8</span>
          </div>

          <div className="flex items-center space-x-1 text-white">
            <MapPin className="h-5 w-5" />
            <span>Bogotá</span>
          </div>
        </div>

        <div className="flex justify-between mt-4 space-x-2">
          <Link href={`/perfiles/${escort.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              Visitar Perfil
            </Button>
          </Link>

          <Button className="w-full bg-primary text-primary-foreground">
            <Diamond className="mr-2 h-4 w-4" />
            Enviar Joyas
          </Button>
        </div>
      </Flex>
    </Card>
  );
}
