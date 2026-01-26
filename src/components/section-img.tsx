import { Section } from "@radix-ui/themes";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
  imageUrl?: string | null;
  alt?: string;
  imageHint?: string;
}

export default function SectionImg({
  children,
  imageUrl,
  alt,
  imageHint,
}: Props) {
  return (
    <Section className="min-h-screen min-w-full flex flex-col gap-4 items-center justify-center px-4 text-center bg-primary/10 overflow-hidden">
      <Image
        src={
          imageUrl ?? "https://i.ibb.co/gMrKhtLp/In-Shot-20251123-182048081.jpg"
        }
        alt={alt || ""}
        unoptimized
        priority
        className="fixed left-0 top-0 -z-10 h-[100vh] w-full opacity-30 object-cover object-center"
        data-ai-hint={imageHint}
        width={1920}
        height={1080}
      />

      {children}
    </Section>
  );
}
