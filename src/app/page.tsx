"use client";
import Link from "next/link";
import { Button, Flex, Heading, Section } from "@radix-ui/themes";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoginPage() {
  const introGif = PlaceHolderImages.find((p) => p.id === "intro-gif");

  return (
    <Section className="relative h-screen w-full flex flex-col p-0 bg-background">
      {/* Top part with GIF */}
      <div className="relative flex-grow w-full">
        {introGif && (
          <Image
            src={introGif.imageUrl}
            alt={introGif.description}
            layout="fill"
            objectFit="cover"
            className="z-0"
            unoptimized
            priority
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full">
          <Heading
            className="text-8xl md:text-9xl font-headline text-primary"
            style={{
              fontFamily: "'Playball', cursive",
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            Venga Mor
          </Heading>
        </div>
      </div>

      {/* Bottom part with buttons */}
      <Flex
        direction="column"
        align="center"
        gap="4"
        className="bg-background p-6 z-20 w-full"
      >
        <div className="w-full max-w-sm">
          <Flex direction="column" gap="4" className="w-full">
            <Link href="/iniciar-sesion" className="w-full">
              <Button
                size="4"
                className="w-full cursor-pointer bg-primary text-primary-foreground h-14 text-lg"
              >
                Ingresar
              </Button>
            </Link>

            <Link href="/perfiles" className="w-full">
              <Button
                size="4"
                variant="soft"
                className="w-full cursor-pointer bg-muted h-14 text-lg"
              >
                Ver perfiles
              </Button>
            </Link>
          </Flex>
        </div>
      </Flex>
    </Section>
  );
}
