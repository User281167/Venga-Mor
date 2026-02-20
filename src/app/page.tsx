"use client";
import Link from "next/link";
import { Button, Flex, Heading, Section } from "@radix-ui/themes";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoginPage() {
  const introGif = PlaceHolderImages.find((p) => p.id === "intro-gif");

  return (
    <Section className="relative h-screen w-full flex flex-col items-center justify-center p-0 overflow-hidden bg-black">
      {/* Background GIF - Fill the screen and align to top */}
      {introGif && (
        <Image
          src={introGif.imageUrl}
          alt={introGif.description}
          layout="fill"
          objectFit="cover"
          objectPosition="top"
          className="z-0"
          unoptimized
          priority
        />
      )}

      {/* Gradient Overlay for readability and style */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

      {/* Centered Title */}
      <div className="relative z-20 flex-grow flex flex-col items-center justify-center">
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

      {/* Buttons container at the bottom */}
      <div className="relative z-20 w-full max-w-sm mx-auto p-6">
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
              variant="surface"
              highContrast
              className="w-full cursor-pointer h-12 text-lg font-semibold"
            >
              Ver perfiles
            </Button>
          </Link>
        </Flex>
      </div>
    </Section>
  );
}
