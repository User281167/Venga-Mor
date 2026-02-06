import React from "react";
import { useVideoVisibility } from "./use-video-visibility";
import { MediaSlide } from "./modal-slide";
import { Flex, Text } from "@radix-ui/themes";
import { Separator } from "@radix-ui/themes/components/select";

export const ModalMediaSlide = React.memo(function ModalMediaSlide({
  slide,
}: {
  slide: MediaSlide;
}) {
  const videoRef = useVideoVisibility();
  let content;

  if (slide.type === "video") {
    content = (
      <video
        ref={videoRef}
        src={slide.url}
        controls
        muted
        playsInline
        className="max-h-full max-w-full object-contain flex-1"
      />
    );
  } else {
    content = (
      <img
        src={slide.url}
        className="max-h-full max-w-full object-contain flex-1"
      />
    );
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="4"
      className="w-full h-full"
      mt="6"
    >
      <Flex direction="column" gap="4" className="w-full">
        <Text as="p" className="text-white text-center">
          {slide.description}
        </Text>

        <Separator className="w-full" size="2" />

        <Text as="p" className="text-gray-400">
          {new Date(slide.publicado).toLocaleDateString()}
        </Text>
      </Flex>

      {content}
    </Flex>
  );
});
