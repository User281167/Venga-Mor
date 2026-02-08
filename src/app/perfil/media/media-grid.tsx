"use client";

import { Grid, Text, Box } from "@radix-ui/themes";
import { MediaItem } from "./media-item";

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

export default MediaGrid;
