import React from "react";
import { MediaFile, PostData } from "@/types/post";

type Props = {
  post: PostData;
  onClick: () => void;
};

function PostSlideComponent({ post, onClick }: Props) {
  return (
    <div
      className="h-96 bg-black flex items-center justify-center rounded-lg overflow-hidden"
      onClick={onClick}
    >
      {post?.media?.video?.url ? (
        <video
          src={post.media.video.url}
          controls
          className="h-full w-full object-contain"
        />
      ) : (
        post.media?.images?.map((image: MediaFile, j: number) => (
          <img
            key={image.name + j}
            src={image.url}
            className="h-full w-full object-contain"
          />
        ))
      )}
    </div>
  );
}

// solo re-renderiza si el post cambia
export const PostSlide = React.memo(PostSlideComponent);
