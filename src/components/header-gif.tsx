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
    <Section className="relative h-screen min-w-full flex flex-col items-center justify-center px-4 text-center bg-primary/10 overflow-hidden">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          unoptimized
          priority
          className="absolute -z-10 h-screen w-full object-cover object-center transition-all duration-1000 ease-in-out"
          style={{ opacity: bgOpacity / 100 }}
          data-ai-hint={imageHint}
          width={1920}
          height={1080}
        />
      )}

      {children}
    </Section>
  );
}
