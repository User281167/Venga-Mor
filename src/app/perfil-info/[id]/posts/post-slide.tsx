import React from "react";

type Props = {
  url: string;
  onClick: () => void;
};

export const VideoSlide = React.memo(function VideoSlide({
  url,
  onClick,
}: Props) {
  return (
    <video
      src={url}
      controls
      muted
      className="h-full w-full object-contain"
      onClick={onClick}
    />
  );
});

export const ImageSlide = React.memo(function ImageSlide({
  url,
  onClick,
}: Props) {
  return (
    <img src={url} className="h-full w-full object-contain" onClick={onClick} />
  );
});
