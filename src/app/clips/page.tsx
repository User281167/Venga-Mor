"use client";
import { usePostsFeed } from "@/app/perfil/posts/post.hook";
import { Heading, Section, Text } from "@radix-ui/themes";
import { ClipItem } from "./clip-item";
import { Loader2 } from "lucide-react";
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
      id="clips-container"
      className="relative h-[calc(100vh-64px)] w-full overflow-y-auto scroll-snap-y-mandatory bg-black"
    >
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
    </Section>
  );
}
