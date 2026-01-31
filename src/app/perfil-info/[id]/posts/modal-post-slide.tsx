import React from "react";
import { useVideoVisibility } from "./use-video-visibility";
import { MediaSlide } from "./modal-slide";

export const ModalMediaSlide = React.memo(function ModalMediaSlide({
  slide,
}: {
  slide: MediaSlide;
}) {
  const videoRef = useVideoVisibility();

  if (slide.type === "video") {
    return (
      <video
        ref={videoRef}
        src={slide.url}
        controls
        muted
        playsInline
        className="max-h-full max-w-full object-contain flex-1"
      />
    );
  }

  return (
    <img
      src={slide.url}
      className="max-h-full max-w-full object-contain flex-1"
    />
  );
});
