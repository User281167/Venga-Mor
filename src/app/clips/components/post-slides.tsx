"use client";

import React, { useEffect } from "react";

// ─── VideoSlide ────────────────────────────────────────────────────────────────

interface VideoSlideProps {
  url: string;
  isActive: boolean;
  onDodgeChange?: (dodging: boolean) => void;
}

export const VideoSlide = React.memo(function VideoSlide({
  url,
  isActive,
  onDodgeChange,
}: VideoSlideProps) {
  const videoRef = useVideoVisibility();
  const { containerRef, dodging } = useOverlayDodge(isActive);

  // Notificar al padre cuando el estado dodge cambia
  useEffect(() => {
    onDodgeChange?.(dodging);
  }, [dodging, onDodgeChange]);

  // Pausa forzada al cambiar de slide
  useEffect(() => {
    if (!videoRef.current) return;
    if (!isActive) videoRef.current.pause();
  }, [isActive, videoRef]);

  return (
    <div ref={containerRef} className="h-full w-full relative">
      <video
        ref={videoRef}
        src={url}
        controls
        loop
        playsInline
        className="h-full w-full object-contain"
        // Evitar que un click en los controles propague eventos al swiper
        onPointerDown={(e) => e.stopPropagation()}
      />
    </div>
  );
});

// ─── ImageSlide ────────────────────────────────────────────────────────────────

interface ImageSlideProps {
  url: string;
  alt?: string;
}

export const ImageSlide = React.memo(function ImageSlide({
  url,
  alt = "",
}: ImageSlideProps) {
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-contain"
    />
  );
});

// ─── MultiImageSlide ───────────────────────────────────────────────────────────

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useVideoVisibility } from "../hooks/useVideoVisibility";
import { useOverlayDodge } from "../hooks/useOverlayDodge";

interface MultiImageSlideProps {
  images: Array<{ url: string; name: string }>;
}

export const MultiImageSlide = React.memo(function MultiImageSlide({
  images,
}: MultiImageSlideProps) {
  if (images.length === 1) {
    return <ImageSlide url={images[0].url} alt={images[0].name} />;
  }

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      className="h-full w-full inner-image-swiper"
      touchStartPreventDefault={false}
    >
      {images.map((img) => (
        <SwiperSlide
          key={img.url}
          className="flex items-center justify-center bg-black"
        >
          <ImageSlide url={img.url} alt={img.name} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
});
