"use client";

export function PostSkeleton() {
  return (
    <div className="h-full w-full bg-black flex items-center justify-center relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 animate-pulse" />

      {/* Overlay info simulado */}
      <div className="absolute bottom-0 inset-x-0 px-4 pb-6 md:px-8 md:pb-8 flex flex-col gap-3">
        {/* Avatar + nombre */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
          <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-2 max-w-xs">
          <div className="h-3 w-full rounded-full bg-white/10 animate-pulse" />
          <div className="h-3 w-3/4 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
