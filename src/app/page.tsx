"use client";
import Link from "next/link";
import { Button, Flex, Heading, Section } from "@radix-ui/themes";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoginPage() {
  const introGif = PlaceHolderImages.find((p) => p.id === "intro-gif");

  return (
    <Section className="relative h-screen w-full flex flex-col items-center justify-end p-0 overflow-hidden bg-black">
      {/* Background GIF - Fill the screen and align to top */}
      {introGif && (
        <Image
          src={introGif.imageUrl}
          alt={introGif.description}
          layout="fill"
          objectFit="cover"
          objectPosition="center top"
          className="z-0"
          unoptimized
          priority
        />
      )}

      {/* Gradient Overlay for readability and style */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

      {/* Content container */}
      <div className="relative z-20 w-full max-w-sm mx-auto p-6 flex flex-col items-center text-center">
        <Heading
          className="text-8xl md:text-9xl font-headline text-primary mb-8"
          style={{
            fontFamily: "'Playball', cursive",
            textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          Venga Mor
        </Heading>

        <Flex direction="column" gap="3" className="w-full">
          <Link href="/iniciar-sesion" className="w-full">
            <Button
              size="3"
              className="w-full cursor-pointer bg-primary text-primary-foreground h-12 text-lg font-semibold"
            >
              Ingresar
            </Button>
          </Link>

          <Link href="/perfiles" className="w-full">
            <Button
              size="3"
              variant="soft"
              className="w-full cursor-pointer h-12 text-lg font-semibold bg-black/50 text-white"
            >
              Ver perfiles
            </Button>
          </Link>
        </Flex>
      </div>
    </Section>
  );
}
