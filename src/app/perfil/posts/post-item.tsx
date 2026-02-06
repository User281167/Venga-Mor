import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import { Separator } from "@radix-ui/themes/components/select";
import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import React from "react";
import { PostData } from "@/types/post";

interface PostItemProps {
  post: PostData;
}

export const PostItem = React.memo(function PostItem({ post }: PostItemProps) {
  const allMedia = [...(post.media.images || []), post.media.video].filter(
    Boolean,
  );

  const video = post.media.video;

  return (
    <Dialog.Root>
      <Flex
        direction="column"
        gap="3"
        p="4"
        className="group relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all hover:bg-white/15"
      >
        {/* Header: Fecha y Descripción */}
        <Box className="text-left">
          <Text as="p" className="text-sm  font-medium tracking-wider">
            Pulicación el: {new Date(post.creado).toLocaleDateString()}
          </Text>

          <Separator />

          <Text
            as="p"
            className="text-sm text-white line-clamp-2 mt-1 font-light"
          >
            {post.descripcion}
          </Text>
        </Box>

        {/* Grid 2x2 de Contenido */}
        <Dialog.Trigger asChild>
          <Grid
            columns={{ initial: "1", md: "2" }}
            gap="2"
            className="aspect-square cursor-pointer rounded-xl"
          >
            {allMedia.slice(0, 4).map((item, idx) => {
              const isVideo = video?.url === item?.url;

              return (
                <Box key={idx} className="relative h-full w-full bg-black/20">
                  {isVideo ? (
                    <video
                      src={item?.url ?? "/"}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={item?.url ?? "/"}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </Box>
              );
            })}
          </Grid>
        </Dialog.Trigger>

        {/* Modal de Pantalla Completa */}
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />

          <Dialog.Content className="fixed left-1/2 top-1/2 z-[51] w-[95vw] h-[90vh] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center outline-none">
            <Dialog.Title className="sr-only">Contenido</Dialog.Title>

            <Dialog.Close className="absolute top-0 right-0 border-gray-400/30 border-2 rounded-md z-[100]">
              <XIcon size={32} />
            </Dialog.Close>

            <Carousel
              showArrows={true}
              infiniteLoop={true}
              width="100%"
              dynamicHeight={false}
              className="carousel-root mt-16"
            >
              {allMedia.map((item, i) => (
                <div
                  key={i}
                  className="relative rounded-lg overflow-hidden bg-white/5 flex items-center justify-center"
                  style={{ height: "80vh" }}
                >
                  {video?.url === item?.url ? (
                    <video
                      src={item?.url ?? "/"}
                      controls
                      style={{
                        maxHeight: "80vh",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <img
                      src={item?.url ?? "/"}
                      style={{
                        maxHeight: "80vh",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>
              ))}
            </Carousel>
          </Dialog.Content>
        </Dialog.Portal>
      </Flex>
    </Dialog.Root>
  );
});
