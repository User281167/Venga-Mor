"use client";

import { useCallback, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { Spinner } from "@radix-ui/themes";

import { PostSkeleton } from "./post-skeleton";

import "swiper/css";
import "swiper/css/mousewheel";

import { FeedParams, PostData } from "@/types/post";

import { PostCard } from "./post-card";
import { useFeed } from "../hooks/use-feed";
import { NavButton } from "./NavButton";
import { SlideIndicator } from "./SlideIndicator";

const PREFETCH_THRESHOLD = 3;

interface FeedListProps extends FeedParams {
  className?: string;
}

export function FeedList({ className, ...feedParams }: FeedListProps) {
  const {
    posts,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refresh,
  } = useFeed(feedParams);

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      const idx = swiper.activeIndex;
      setActiveIndex(idx);

      const remaining = posts.length - 1 - idx;
      if (
        remaining <= PREFETCH_THRESHOLD &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [posts.length, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const handleRefresh = useCallback(() => {
    refresh();
    swiperRef.current?.slideTo(0);
  }, [refresh]);

  // Botones de navegación
  const slidePrev = useCallback(() => swiperRef.current?.slidePrev(), []);
  const slideNext = useCallback(() => swiperRef.current?.slideNext(), []);

  // Total de slides incluyendo el de "has visto todo" si aplica
  const totalSlides =
    posts.length +
    (isFetchingNextPage ? 1 : 0) +
    (!hasNextPage && posts.length > 0 ? 1 : 0);

  const isFirst = activeIndex === 0;
  const isLast = activeIndex >= totalSlides - 1;

  // ── Estados de carga / error / vacío ───────────────────────────────────────

  if (isLoading) {
    return (
      <div className={`h-full w-full ${className ?? ""}`}>
        <PostSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-black text-white/60">
        <p className="text-sm">No se pudo cargar el feed</p>
        <p className="text-xs text-white/30">{error?.message}</p>

        <button
          onClick={handleRefresh}
          className="mt-2 text-xs uppercase tracking-widest border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black text-white/30 text-sm tracking-widest uppercase">
        Sin posts
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full bg-black ${className ?? ""}`}>
      <Swiper
        modules={[Mousewheel, Keyboard]}
        direction="vertical"
        slidesPerView={1}
        mousewheel={{ sensitivity: 1, thresholdDelta: 50 }}
        keyboard={{ enabled: true }}
        speed={380}
        className="h-full w-full"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
      >
        {posts.map((post: PostData, index) => (
          <SwiperSlide key={post.id} className="h-full w-full">
            <PostCard post={post} isActive={index === activeIndex} />
          </SwiperSlide>
        ))}

        {isFetchingNextPage && (
          <SwiperSlide className="h-full w-full">
            <div className="h-full w-full bg-black flex items-center justify-center">
              <Spinner size="3" className="text-white/40" />
            </div>
          </SwiperSlide>
        )}

        {!hasNextPage && posts.length > 0 && (
          <SwiperSlide className="h-full w-full">
            <div className="h-full w-full bg-black flex flex-col items-center justify-center gap-4">
              <p className="text-white/30 text-sm tracking-widest uppercase">
                Has visto todo
              </p>

              <button
                onClick={handleRefresh}
                className="text-xs uppercase tracking-widest border border-white/20 rounded-full px-4 py-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                Ver feed nuevo
              </button>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {/* ── Panel derecho: indicador + botones (solo desktop) ─────────────── */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
        <NavButton direction="up" onClick={slidePrev} disabled={isFirst} />

        <SlideIndicator current={activeIndex + 1} total={posts.length} />

        <NavButton direction="down" onClick={slideNext} disabled={isLast} />
      </div>
    </div>
  );
}
