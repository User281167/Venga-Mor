"use client";
import Link from "next/link";
import { Button, Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import PayPalPayment from "@/components/pay-pal";
import HeaderGif from "@/components/header-gif";

const rotatingTexts = [
  "Servicios íntimos",
  "Privacidad",
  "La app para los mayores",
  "Diversión y sensualidad",
  "Seguridad y compromiso",
];

export default function LoginPage() {
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
    <HeaderGif>
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
    </HeaderGif>
  );
}
