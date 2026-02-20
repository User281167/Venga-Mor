"use client";
import Link from "next/link";
import { Button, Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import PayPalPayment from "@/components/pay-pal";
import HeaderGif from "@/components/header-gif";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const rotatingTexts = [
  "Servicios íntimos",
  "Privacidad",
  "La app para los mayores",
  "Diversión y sensualidad",
  "Seguridad y compromiso",
];

const backgroundImages = [
  PlaceHolderImages.find((p) => p.id === "intro-gif"),
  PlaceHolderImages.find((p) => p.id === "intro-gif-2"),
].filter(Boolean);

export default function LoginPage() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [bgImage, setBgImage] = useState(backgroundImages[0]);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex(
        (prevIndex) => (prevIndex + 1) % rotatingTexts.length,
      );
    }, 3000);

    const bgInterval = setInterval(() => {
      setBgImage((current) =>
        current?.id === "intro-gif"
          ? backgroundImages[1]!
          : backgroundImages[0]!,
      );
    }, 6000); // Change background every 6 seconds

    return () => {
      clearInterval(textInterval);
      clearInterval(bgInterval);
    };
  }, []);

  return (
    <HeaderGif imageUrl={bgImage?.imageUrl}>
      <Flex
        direction="column"
        align="center"
        gap="6"
        className="w-full max-w-md"
      >
        <Heading
          className="text-8xl md:text-9xl font-headline text-primary"
          style={{ fontFamily: "'Playball', cursive" }}
        >
          Venga Mor
        </Heading>

        <p className="text-white mt-4 text-xl md:text-2xl h-8 transition-opacity duration-500">
          {rotatingTexts[currentTextIndex]}
        </p>

        <Link href="/iniciar-sesion" className="w-full">
          <Button
            size="4"
            className="bg-primary w-full cursor-pointer text-primary-foreground"
          >
            Ingresar
          </Button>
        </Link>

        <Link href="/perfiles" className="w-full">
          <Button
            size="4"
            variant="soft"
            className="w-full bg-secondary cursor-pointer"
          >
            Ver perfiles
          </Button>
        </Link>

        <PayPalPayment className="w-full" />
      </Flex>
    </HeaderGif>
  );
}
