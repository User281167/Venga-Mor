"use client";

import { Card, Inset, Text, IconButton, Flex, Box } from "@radix-ui/themes";
import { X, FileVideo, FileImage } from "lucide-react";
import React, { useEffect, useState } from "react";

// Sub-componente para manejar la URL de previsualización de forma eficiente
interface MediaItemProps {
  file: File;
  onRemove: () => void;
}

export const MediaItem = React.memo(function MediaItem({
  file,
  onRemove,
}: MediaItemProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("/");
  const isVideo = file.type.startsWith("video/");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Limpieza de memoria al desmontar el componente
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <Card size="1" className="relative group overflow-hidden">
      {/* Botón Eliminar (Flotante) */}
      <Box className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          variant="solid"
          color="red"
          highContrast
          radius="full"
          size="1"
          onClick={onRemove}
          className="cursor-pointer shadow-md"
        >
          <X size={14} />
        </IconButton>
      </Box>

      <Inset clip="padding-box" side="top" pb="current">
        <Flex
          align="center"
          justify="center"
          className="bg-gray-100 aspect-square overflow-hidden"
        >
          {isVideo ? (
            <video
              src={previewUrl}
              controls
              className="object-cover w-full h-full"
            />
          ) : (
            <img
              src={previewUrl}
              alt={file.name}
              className="object-cover w-full h-full transition-transform group-hover:scale-110"
            />
          )}
        </Flex>
      </Inset>

      <Flex align="center" gap="2" p="2">
        {isVideo ? (
          <FileVideo size={14} className="text-blue-500" />
        ) : (
          <FileImage size={14} className="text-green-500" />
        )}
        <Text size="1" truncate color="gray" weight="medium">
          {file.name}
        </Text>
      </Flex>
    </Card>
  );
});
