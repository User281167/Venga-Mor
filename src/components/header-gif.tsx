import { Section } from "@radix-ui/themes";
import Image from "next/image";

import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function HeaderGif({
  children,
  imageUrl: customImageUrl,
}: {
  children: React.ReactNode;
  imageUrl?: string;
}) {
  const introGif = PlaceHolderImages.find((p) => p.id === "intro-gif");

  const imageUrl = customImageUrl || introGif?.imageUrl;
  const imageAlt = customImageUrl
    ? "Background"
    : introGif?.description || "Introducción Venga Mor";
  const imageHint = customImageUrl
    ? "woman neon"
    : introGif?.imageHint || "woman animation";

  return (
    <Section className="relative min-h-screen min-w-full flex flex-col items-center justify-center px-4 text-center bg-primary/10 overflow-hidden">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          unoptimized
          priority
          className="absolute -z-10 h-screen w-full opacity-30 object-cover object-center transition-all duration-1000 ease-in-out"
          data-ai-hint={imageHint}
          width={1920}
          height={1080}
        />
      )}

      {children}
    </Section>
  );
}
