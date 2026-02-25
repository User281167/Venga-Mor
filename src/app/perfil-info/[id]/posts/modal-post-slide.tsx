import React from "react";
import { useVideoVisibility } from "./use-video-visibility";
import { MediaSlide } from "./modal-slide";
import { Flex, Separator, Text } from "@radix-ui/themes";

export const ModalMediaSlide = React.memo(function ModalMediaSlide({
  slide,
}: {
  slide: MediaSlide;
}) {
  const videoRef = useVideoVisibility();
  let content;

  return (
    <Flex direction="column" className="w-full h-full">
      <Flex direction="column" gap="4" className="w-full">
        <Text as="p" className="text-white text-center">
          {slide.description}
        </Text>

        <Separator className="w-full" size="2" />

        <Text as="p" className="text-gray-400">
          {new Date(slide.publicado).toLocaleDateString()}
        </Text>
      </Flex>

      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        {slide.type === "video" ? (
          <video
            ref={videoRef}
            src={slide.url}
            controls
            autoPlay
            playsInline
            className="w-full max-h-full object-contain"
          />
        ) : (
          <img src={slide.url} className="w-full max-h-full object-contain" />
        )}
      </div>
    </Flex>
  );
});
