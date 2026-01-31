"use client";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button, Grid, Heading, Section } from "@radix-ui/themes";
import Image from "next/image";

import { usePostsFeed } from "./post.hook";
import { PostItem } from "./post-item";

export default function PerfilPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "profile-bg");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = usePostsFeed();

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Section className="min-h-screen min-w-full flex flex-col gap-4 items-center justify-center px-4 text-center bg-primary/10 overflow-hidden">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt="Introducción Venga Mor"
          unoptimized
          priority
          className="fixed left-0 top-0 -z-10 h-screen w-full opacity-30 object-cover object-center"
          data-ai-hint={bgImage.imageHint}
          width={1920}
          height={1080}
        />
      )}

      <header className="mb-12">
        <Heading className="text-4xl font-bold text-primary text-center">
          Mis publicaciones
        </Heading>

        {isError && <p className="text-red-400 mt-2">{error.message}</p>}
      </header>

      <Grid
        columns={{ sm: "1", md: "2", lg: "3" }}
        gap="6"
        width="auto"
        className="max-w-screen-2xl"
      >
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </Grid>

      {/* Estados de Carga / Botón Cargar Más */}
      <footer className="mt-12 mb-20">
        {(isLoading || isFetchingNextPage) && (
          <div className="animate-pulse text-primary font-medium bg-gray-50/50 w-full px-3 py-2 rounded-md">
            Cargando contenido...
          </div>
        )}

        {hasNextPage && !isLoading && (
          <Button
            size="3"
            onClick={() => fetchNextPage()}
            className="px-8 bg-primary text-white font-semibold transition-transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Ver más publicaciones
          </Button>
        )}

        {!hasNextPage && posts.length > 0 && (
          <p className="text-primary text-sm italic bg-gray-50/50 w-full px-3 py-2 rounded-md">
            Has llegado al final de tus publicaciones
          </p>
        )}
      </footer>
    </Section>
  );
}
