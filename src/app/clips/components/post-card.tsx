"use client";

import React, { useState, useCallback } from "react";
import { Avatar } from "@radix-ui/themes";
import { VideoSlide, MultiImageSlide } from "./post-slides";
import { PostData } from "@/types/post";
import Link from "next/link";

interface PostCardProps {
  post: PostData;
  isActive: boolean;
}

export const PostCard = React.memo(function PostCard({
  post,
  isActive,
}: PostCardProps) {
  const hasVideo = !!post.media.video?.url;
  const images = post.media.images ?? [];
  const hasImages = images.length > 0;

  // Cuando el cursor/touch entra en la zona de controles del video,
  // el overlay baja su z-index para no interferir.
  const [overlayDodging, setOverlayDodging] = useState(false);

  const handleDodgeChange = useCallback((dodging: boolean) => {
    setOverlayDodging(dodging);
  }, []);

  const fecha = new Date(post.creado).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative h-full w-full bg-black select-none overflow-hidden">
      {/* ── Media ────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center">
        {hasVideo && (
          <VideoSlide
            url={post.media.video!.url}
            isActive={isActive}
            onDodgeChange={handleDodgeChange}
          />
        )}
        {!hasVideo && hasImages && <MultiImageSlide images={images} />}
        {!hasVideo && !hasImages && (
          <div className="flex items-center justify-center text-white/20 text-sm tracking-widest uppercase">
            Sin media
          </div>
        )}
      </div>

      {/*
        ── Overlay inferior ──────────────────────────────────────────────────────
        Cuando `overlayDodging` es true:
          • z-index baja a -10 → el overlay queda detrás del video
          • pointer-events: none → los clicks pasan directo a los controles
          • opacity baja a 0 → feedback visual de que "se apartó"
        Transición de 200 ms para que no sea un salto brusco.
      */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-4 pb-6 md:px-8 md:pb-8 transition-all duration-200"
        style={{
          // Gradiente integrado en el mismo div para sincronizar la transición
          background: overlayDodging
            ? "transparent"
            : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
          zIndex: overlayDodging ? -10 : 10,
          pointerEvents: overlayDodging ? "none" : "auto",
          opacity: overlayDodging ? 0 : 1,
          // Altura suficiente para cubrir la zona del gradiente
          paddingTop: "6rem",
        }}
      >
        {/* Autor */}
        <Link
          href={`/perfil-info/${post.autorId}`}
          className="flex items-center gap-2"
        >
          <Avatar
            size="2"
            fallback={post.autorId?.[0]?.toUpperCase() ?? "?"}
            radius="full"
            className="ring-2 ring-white/30"
          />
          <span className="text-white/90 text-sm font-medium tracking-wide">
            @{post.autorId}
          </span>
          <span className="text-white/40 text-xs ml-auto">{fecha}</span>
        </Link>

        {/* Descripción */}
        {post.descripcion && (
          <p className="text-white/85 text-sm leading-snug line-clamp-3 max-w-[85%] md:max-w-lg">
            {post.descripcion}
          </p>
        )}

        {/* Badge tipo de media */}
        <div className="flex gap-2 mt-1">
          {hasVideo && (
            <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 rounded-full px-2 py-0.5">
              video
            </span>
          )}
          {hasImages && (
            <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 rounded-full px-2 py-0.5">
              {images.length === 1 ? "foto" : `${images.length} fotos`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
