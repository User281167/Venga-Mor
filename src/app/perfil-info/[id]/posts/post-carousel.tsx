"use client";

import { Button, Dialog, Skeleton, Spinner } from "@radix-ui/themes";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Virtual } from "swiper/modules";
import { useCallback, useMemo, useState } from "react";

import { usePublicPosts } from "./post.hook";
import { ImageSlide, VideoSlide } from "./post-slide";
import { ModalMediaSlide } from "./modal-post-slide";
import { toast } from "sonner";
import { MediaSlide } from "./modal-slide";
import { XIcon } from "lucide-react";

export default function PostCarousel({ id }: { id: string }) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = usePublicPosts(id);

  const posts = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper) => {
    const remaining = swiper.slides.length - swiper.activeIndex;

    if (remaining <= 3 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }

    document.querySelectorAll("video").forEach((v) => v.pause());
  };

  const handleReachEnd = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleOpen = useCallback((index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  }, []);

  if (isError) {
    toast.error(error.message);
  }

  const mediaSlides: MediaSlide[] = useMemo(() => {
    return posts.flatMap((post) => {
      const out: MediaSlide[] = [];

      if (post.media?.video?.url) {
        out.push({
          postId: post.id,
          type: "video",
          url: post.media.video.url,
          description: post.descripcion,
          publicado: post.creado,
        });
      }

      post.media?.images?.forEach((img) => {
        out.push({
          postId: post.id,
          type: "image",
          url: img.url,
          description: post.descripcion,
          publicado: post.creado,
        });
      });

      return out;
    });
  }, [posts]);

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="text-muted-foreground">
          No hay publicaciones para mostrar.
        </p>
      </div>
    );
  }

  return (
    <>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={12}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
        className="w-full h-96"
        onSlideChange={handleSlideChange}
        onReachEnd={handleReachEnd}
      >
        {mediaSlides.map((slide, index) => (
          <SwiperSlide
            key={`${slide.postId}-${slide.url}`}
            className="h-96 bg-black flex items-center justify-center rounded-lg overflow-hidden"
          >
            {slide.type === "video" ? (
              <VideoSlide url={slide.url} onClick={() => handleOpen(index)} />
            ) : (
              <ImageSlide url={slide.url} onClick={() => handleOpen(index)} />
            )}
          </SwiperSlide>
        ))}

        {(isLoading || isFetchingNextPage) &&
          Array.from({ length: 4 }).map((_, index) => (
            <SwiperSlide key={index}>
              <Skeleton className="h-96"></Skeleton>
            </SwiperSlide>
          ))}
      </Swiper>

      <Dialog.Root open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
        <Dialog.Content
          aria-describedby="posts-carousel-description"
          className="
              fixed inset-0 z-50
              h-[90vh] w-full md:max-w-4xl xl:max-w-7xl
              flex items-center justify-center
              outline-none
              bg-stone-900
            "
        >
          <Dialog.Title className="sr-only">Posts</Dialog.Title>

          <Dialog.Close className="absolute top-4 right-4">
            <Button variant="ghost" size="4" className="z-10">
              <XIcon />
            </Button>
          </Dialog.Close>

          <Swiper
            modules={[Navigation, Virtual]}
            initialSlide={activeIndex}
            slidesPerView={1}
            navigation
            className="w-full h-full"
            onSwiper={(swiper) => {
              swiper.slideTo(activeIndex, 0);
            }}
            onSlideChange={handleSlideChange}
            onReachEnd={handleReachEnd}
          >
            {mediaSlides.map((slide, index) => (
              <SwiperSlide key={index} virtualIndex={index}>
                <ModalMediaSlide slide={slide} />
              </SwiperSlide>
            ))}

            {(isLoading || isFetchingNextPage) && (
              <SwiperSlide>
                <div className="h-96 flex items-center justify-center">
                  <Spinner className="m-auto" />
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
