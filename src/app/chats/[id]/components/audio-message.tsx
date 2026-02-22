"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { useAudioPlayer } from "../audio-player.context";
import { useTheme } from "@/context/theme-context";

interface AudioMessageProps {
  src: string;
  isMyMessage: boolean;
  audioId: string;
}

export function AudioMessage({ src, isMyMessage, audioId }: AudioMessageProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentPlayingId, setCurrentPlayingId } = useAudioPlayer();
  const isPlaying = currentPlayingId === audioId;
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const { currentForegroundColor } = useTheme();

  // Cuando otro audio empieza a reproducirse, pausar este
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentPlayingId !== audioId) {
      audio.pause();
      audio.currentTime = 0;
      setProgress(0);
      setCurrentTime("0:00");
    }
  }, [currentPlayingId, audioId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onCanPlay = () => setIsLoading(false);
    const onLoadedMetadata = () => setDuration(formatTime(audio.duration));
    const onTimeUpdate = () => {
      setCurrentTime(formatTime(audio.currentTime));
      setProgress(
        audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
      );
    };
    const onEnded = () => {
      setCurrentPlayingId(null);
      setProgress(0);
      setCurrentTime("0:00");
    };

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setCurrentPlayingId(null);
    } else {
      // Esto detiene cualquier otro audio via el useEffect de arriba
      setCurrentPlayingId(audioId);
      audio.play();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  };

  const my = isMyMessage;

  return (
    <div className="flex items-center gap-3 w-full">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        disabled={isLoading}
        className={`
          shrink-0 w-9 h-9 rounded-full flex items-center justify-center
          transition-all duration-150 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed
          ${
            my
              ? "hsl(var(--primary)) hover:bg-white/40 text-primary-foreground"
              : "bg-black/10 hover:bg-black/20 text-foreground"
          }
        `}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </button>

      {/* Barra de progreso + tiempo */}
      <div className="flex flex-col flex-1 gap-1.5 w-full">
        {/* Track clickeable */}
        <div
          onClick={handleSeek}
          className="relative h-1.5 rounded-full cursor-pointer group w-full"
          style={{
            background: my
              ? `hsl(${currentForegroundColor} / 0.15)`
              : "rgba(0,0,0,0.15)",
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-100 w-full"
            style={{
              width: `${progress}%`,
              background: my
                ? `hsl(${currentForegroundColor})`
                : "hsl(var(--primary))",
            }}
          />
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-sm
                        opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${my ? "bg-black" : "bg-primary"}`}
            style={{
              left: `calc(${progress}% - 6px)`,
              background: my
                ? `hsl(${currentForegroundColor}`
                : "hsl(var(--primary))",
            }}
          />
        </div>

        <span
          className={`text-[10px] tabular-nums leading-none select-none ${my ? "text-primary-foreground" : "text-white"}`}
        >
          {isPlaying ? currentTime : duration}
        </span>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
