import { Section } from "@radix-ui/themes";
import Image from "next/image";

import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function HeaderGif({ children }: { children: React.ReactNode }) {
  const introGif = PlaceHolderImages.find((p) => p.id === "intro-gif");

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

      {children}
    </Section>
  );
}
