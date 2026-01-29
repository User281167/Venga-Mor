"use client";

import { Button, Dialog, Spinner } from "@radix-ui/themes";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Virtual } from "swiper/modules";
import { useCallback, useEffect, useState } from "react";

import { usePublicPostsFeed } from "./post.hook";
import { toast } from "sonner";
import { PostSlide } from "./post-slide";
import { ModalPostSlide } from "./modal-post-slide";

export default function PostCarousel({ id }: { id: string }) {
  const { posts, isLoading, hasMore, loadMore, error } = usePublicPostsFeed(id);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSlideChange = (swiper) => {
    const remaining = swiper.slides.length - swiper.activeIndex;

    if (remaining <= 3 && hasMore && !isLoading) {
      loadMore();
    }

    document.querySelectorAll("video").forEach((v) => v.pause());
  };

  const handleReachEnd = () => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  };

  const handleOpen = useCallback((index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  }, []);

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
        {posts.map((post, i) => (
          <SwiperSlide key={post.id}>
            <PostSlide post={post} onClick={() => handleOpen(i)} />
          </SwiperSlide>
        ))}

        {isLoading && (
          <SwiperSlide>
            <div className="h-96 flex items-center justify-center">
              <Spinner className="m-auto" />
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      <Dialog.Root open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
        <Dialog.Content
          aria-describedby="posts-carousel-description"
          className="
              fixed inset-0 z-50
              h-[90vh] w-screen
              flex items-center justify-center
              outline-none
              bg-stone-900
            "
        >
          <Dialog.Title className="sr-only">Posts</Dialog.Title>

          <Dialog.Close className="absolute top-4 right-4">
            <Button variant="ghost" size="4">
              ✕
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
            {posts.map((item, i) => (
              <SwiperSlide key={item.id} virtualIndex={i}>
                <ModalPostSlide post={item} />
              </SwiperSlide>
            ))}

            {isLoading && (
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
