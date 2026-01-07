"use client";
import Image from "next/image";
import Link from "next/link";
import { Button, Flex, Heading, Section } from "@radix-ui/themes";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";
import PayPalPayment from "@/components/pay-pal";

const rotatingTexts = [
  "Servicios íntimos",
  "Privacidad",
  "La app para los mayores",
  "Diversión y sensualidad",
  "Seguridad y compromiso",
];

export default function LoginPage() {
  const introGif = PlaceHolderImages.find((p) => p.id === "intro-gif");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex(
        (prevIndex) => (prevIndex + 1) % rotatingTexts.length,
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section className="relative min-h-screen min-w-full flex flex-col items-center justify-center px-4 text-center bg-primary/10 overflow-hidden">
      {introGif && (
        <Image
          src={introGif.imageUrl}
          alt="Introducción Venga Mor"
          unoptimized
          priority
          className="absolute -z-10 h-screen w-full opacity-30 object-cover object-center"
          data-ai-hint={introGif.imageHint}
          width={1920}
          height={1080}
        />
      )}

      <Flex direction="column" align="center" gap="5">
        <Heading
          className="text-8xl md:text-9xl font-headline text-primary"
          style={{ fontFamily: "'Playball', cursive" }}
        >
          Venga Mor
        </Heading>

        <p className="text-white mt-4 text-lg md:text-xl h-6 transition-opacity duration-500">
          {rotatingTexts[currentTextIndex]}
        </p>

        <Link href="/login" className="w-full">
          <Button size="4" className="bg-primary w-full cursor-pointer">
            Ingresar
          </Button>
        </Link>

        <Link href="/Ver perfiles" className="w-full">
          <Button
            size="3"
            variant="soft"
            className="w-full bg-secondary cursor-pointer"
          >
            Ver perfiles
          </Button>
        </Link>

        <PayPalPayment className="w-full" />
      </Flex>
    </Section>
  );
}
