import { PostData } from "@/types/post";
import React from "react";
import { useVideoVisibility } from "./use-video-visibility";

export const ModalPostSlide = React.memo(function ModalPostSlide({
  post,
}: {
  post: PostData;
}) {
  const videoRef = useVideoVisibility();

  return (
    <div className="w-full h-full flex items-center justify-center">
      {post.media.video?.url ? (
        <video
          ref={videoRef}
          src={post.media.video.url}
          controls
          muted
          playsInline
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        post.media.images.map((image, j) => (
          <img
            key={image.name + j}
            src={image.url}
            className="h-full w-full object-contain"
          />
        ))
      )}
    </div>
  );
});
