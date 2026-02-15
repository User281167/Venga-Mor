"use client";
import { usePostsFeed } from "@/app/perfil/posts/post.hook";
import { Heading, Section, Text } from "@radix-ui/themes";
import { ClipItem } from "./clip-item";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect } from "react";

export default function ClipsPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, error } = usePostsFeed();

  const posts = data?.pages.flatMap((page) => page.data) || [];

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("clips-container");
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;

        if (
          scrollTop + clientHeight >= scrollHeight - 5 &&
          hasNextPage &&
          !isLoading
        ) {
          fetchNextPage();
        }
      }
    };

    const container = document.getElementById("clips-container");
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isLoading, fetchNextPage]);

  return (
    <Section
      className="relative h-[calc(100vh-64px)] w-full bg-black flex flex-col"
    >
      {/* Header with Weekly Challenge */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="max-w-md mx-auto text-center p-2 rounded-lg bg-primary/20 border border-primary/50 backdrop-blur-sm">
              <Heading as="h2" size="4" className="text-primary flex items-center justify-center gap-2">
                  <Sparkles size={18}/>
                  Reto de la Semana
              </Heading>
              <Text as="p" size="1" className="text-white/80 mt-1">
                  ¡El clip más votado gana 1000 joyas!
              </Text>
          </div>
      </div>
        
      {/* Clips Container */}
      <div id="clips-container" className="flex-grow w-full overflow-y-auto scroll-snap-y-mandatory">
        <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative h-[calc(100vh-64px)] w-full flex-shrink-0 scroll-snap-start flex items-center justify-center"
              >
                <ClipItem post={post} />
              </div>
            ))}

            {isLoading && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center text-white bg-black/50 rounded-full p-2">
                <Loader2 className="animate-spin mr-2" />
                <Text>Cargando clips...</Text>
              </div>
            )}

            {!hasNextPage && posts.length > 0 && (
              <div className="relative h-[calc(100vh-64px)] w-full flex-shrink-0 scroll-snap-start flex items-center justify-center text-white">
                <Text>Fin de los clips.</Text>
              </div>
            )}

            {posts.length === 0 && !isLoading && (
              <div className="relative h-[calc(100vh-64px)] w-full flex-shrink-0 scroll-snap-start flex items-center justify-center text-white text-center p-4">
                <div>
                  <Heading>No hay clips todavía.</Heading>
                  <Text as="p" color="gray">
                    Los colaboradores aún no han publicado nada.
                  </Text>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-center p-4">{error.message}</div>
            )}
        </div>
      </div>
    </Section>
  );
}
