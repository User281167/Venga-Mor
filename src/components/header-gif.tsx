import { Section } from "@radix-ui/themes";
import Image from "next/image";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useTheme } from "@/context/theme-context";

export default function HeaderGif({
  children,
  imageUrl: customImageUrl,
}: {
  children: React.ReactNode;
  imageUrl?: string;
}) {
  const introGif = PlaceHolderImages.find((p) => p.id === "intro-gif");
  const { bgOpacity } = useTheme();

  const imageUrl = customImageUrl || introGif?.imageUrl;
  const imageAlt = customImageUrl
    ? "Background"
    : introGif?.description || "Introducción Venga Mor";
  const imageHint = customImageUrl
    ? "woman neon"
    : introGif?.imageHint || "woman animation";

  return (
    <Section className="relative h-screen w-full flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          unoptimized
          priority
          layout="fill"
          objectFit="cover"
          className="absolute -z-10 w-full h-full transition-all duration-1000 ease-in-out"
          style={{ opacity: bgOpacity / 100 }}
          data-ai-hint={imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-0" />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </Section>
  );
}
