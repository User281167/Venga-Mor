import {
  Grid,
  Card,
  Inset,
  Text,
  IconButton,
  Flex,
  Box,
} from "@radix-ui/themes";
import { X, FileVideo, FileImage } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaGridProps {
  files: File[];
  onRemove: (index: number) => void;
}

const MediaGrid = ({ files, onRemove }: MediaGridProps) => {
  if (files.length === 0) return null;

  return (
    <Box mt="4" className="max-w-screen-xl w-full mx-auto">
      <Text size="2" weight="bold" color="gray" mb="2" as="div">
        Previsualización ({files.length})
      </Text>

      <Grid columns={{ initial: "2", sm: "3" }} gap="3" width="auto">
        {files.map((file, index) => (
          <MediaItem
            key={`${file.name}-${index}`}
            file={file}
            onRemove={() => onRemove(index)}
          />
        ))}
      </Grid>
    </Box>
  );
};

// Sub-componente para manejar la URL de previsualización de forma eficiente
const MediaItem = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
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
};

export default MediaGrid;
