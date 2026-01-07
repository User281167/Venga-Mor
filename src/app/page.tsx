"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@radix-ui/themes";
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
    <div className="relative flex flex-col items-center justify-center h-screen w-screen -m-8 -mb-24 overflow-hidden">
      {introGif && (
        <Image
          src={introGif.imageUrl}
          alt="Introducción Venga Mor"
          unoptimized
          className="absolute z-0 h-[calc(100%-250px)] object-cover object-top w-full"
          data-ai-hint={introGif.imageHint}
          width={1920}
          height={1080}
        />
      )}

      <div className="absolute inset-0 bg-black/70 z-10"></div>
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white p-4 w-full max-w-md">
        <h1
          className="text-8xl md:text-9xl font-headline text-primary"
          style={{ fontFamily: "'Playball', cursive" }}
        >
          Venga Mor
        </h1>

        <p className="text-white mt-4 text-lg md:text-xl h-6 transition-opacity duration-500">
          {rotatingTexts[currentTextIndex]}
        </p>

        <Link href="/login" className="w-full mt-12 px-4">
          <Button
            size="3"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-transform duration-300 text-xl py-6 rounded-full shadow-lg"
          >
            Ingresar
          </Button>
        </Link>

        <Link href="/Ver perfiles" className="w-full mt-4 px-4">
          <Button
            size="3"
            className="w-full text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-transform duration-300 text-xl py-6 rounded-full shadow-lg bg-gray-300/70"
          >
            Ver perfiles
          </Button>
        </Link>

        <PayPalPayment className="mt-4 w-full px-4" />
      </div>
    </div>
  );
}
