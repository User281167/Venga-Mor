"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Avatar } from "@radix-ui/themes";
import { VideoSlide, MultiImageSlide } from "./post-slides";
import { PostData } from "@/types/post";
import Link from "next/link";
import { ProfileShield } from "@/components/profile-shield";
import { getCollaborator } from "@/handlers/getPublicCollaborator";
import { Collaborator } from "@/types/collaborator";

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

  const [author, setAuthor] = useState<Collaborator | null>(null);

  // Cargar datos del autor para mostrar su escudo
  useEffect(() => {
    if (isActive && !author) {
      getCollaborator(post.autorId).then(res => {
        if (res.success && res.data) {
          setAuthor(res.data);
        }
      });
    }
  }, [isActive, post.autorId, author]);

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
      */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-4 pb-6 md:px-8 md:pb-8 transition-all duration-200"
        style={{
          background: overlayDodging
            ? "transparent"
            : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
          zIndex: overlayDodging ? -10 : 10,
          pointerEvents: overlayDodging ? "none" : "auto",
          opacity: overlayDodging ? 0 : 1,
          paddingTop: "6rem",
        }}
      >
        {/* Autor y Escudo */}
        <div className="flex items-center justify-between">
          <Link
            href={`/perfil-info/${post.autorId}`}
            className="flex items-center gap-2"
          >
            <Avatar
              size="2"
              src={author?.foto || undefined}
              fallback={post.autorId?.[0]?.toUpperCase() ?? "?"}
              radius="full"
              className="ring-2 ring-white/30"
            />
            <div className="flex flex-col">
              <span className="text-white/90 text-sm font-medium tracking-wide">
                @{post.autorNombre || post.autorId.slice(0, 6)}
              </span>
              <span className="text-white/40 text-[10px]">{fecha}</span>
            </div>
          </Link>

          {/* ESCUDO EN EL REEL */}
          {author && <ProfileShield collaborator={author} size={40} className="mr-2" />}
        </div>

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
