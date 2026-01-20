import {
  Box,
  Card,
  Flex,
  Text,
  Button,
  Grid,
  TextArea,
  Spinner,
} from "@radix-ui/themes";
import { Form } from "radix-ui";
import { Plus, Image, Video, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import ProgressBar from "@/components/ProgressBar";
import MediaGrid from "./media-grid";

import { useUser } from "@/context/user-context";
import { createMediaPost } from "./media-handler";
import { useMediaUploadForm } from "./media.hook";

export default function MediaUploadPanel() {
  const {
    imageInputRef,
    videoInputRef,

    images,
    videos,
    isDragging,
    imgProgress,
    vidProgress,
    isUploading,
    description,

    setImages,
    setVideos,
    setIsUploading,
    setImgProgress,
    setVidProgress,
    setDescription,

    removeImage,
    removeVideo,
    handleFileChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useMediaUploadForm();

  const { user } = useUser();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("No se pudo subir el contenido, usuario no autenticado");
      return;
    }

    setIsUploading(true);

    const result = await createMediaPost(
      user.uid,
      description,
      images,
      videos,
      (progressArray) => setImgProgress(progressArray), // Callback imágenes
      (p) => setVidProgress(p), // Callback video
    );

    if (result.success) {
      // Resetear estados
      setDescription("");
      setImages([]);
      setVideos([]);
      setImgProgress([]);
      setVidProgress(0);
    }

    result.success
      ? toast.success(result.message)
      : toast.error(result.message);

    setIsUploading(false);
  };

  return (
    <div className="w-full">
      <Box mx="auto" className="max-w-screen-lg w-full">
        {/* Inputs Ocultos */}
        <input
          type="file"
          ref={imageInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        <input
          type="file"
          ref={videoInputRef}
          onChange={handleFileChange}
          accept="video/mp4, video/quicktime"
          className="hidden"
        />

        <Card size="3" variant="surface">
          <Flex justify="between" align="center" mb="4">
            <Box>
              <Text as="p" size="4" weight="bold">
                Biblioteca de Medios
              </Text>

              <Text as="p" size="2" color="gray">
                Gestiona tus fotos y videos
              </Text>
            </Box>

            <Button
              disabled={isUploading}
              loading={isUploading}
              onClick={handleSubmit}
              color="green"
              variant="solid"
              highContrast
              radius="full"
              size="3"
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <Plus size={18} strokeWidth={3} />
              Nuevo Contenido
            </Button>
          </Flex>

          <Grid columns="2" gap="3" className="w-full">
            {/* Tarjeta de Imagen */}
            <Card
              variant="ghost"
              onClick={() => imageInputRef.current?.click()}
              hidden={isUploading}
              className="hover:bg-green-50 border border-gray-200 cursor-pointer transition-colors text-white hover:text-black"
            >
              <Flex align="center" gap="3">
                <Box className="bg-green-100 p-2 rounded-lg text-green-700">
                  <Image size={24} />
                </Box>

                <Box>
                  <Text as="p" size="2" weight="bold">
                    Imagen
                  </Text>

                  <Text as="p" size="1">
                    PNG, JPG, WEBP
                  </Text>
                </Box>
              </Flex>
            </Card>

            {/* Tarjeta de Video */}
            <Card
              variant="ghost"
              onClick={() => videoInputRef.current?.click()}
              hidden={isUploading}
              className="hover:bg-blue-50 border border-gray-200 cursor-pointer transition-colors text-white hover:text-black"
            >
              <Flex align="center" gap="3" ml="2">
                <Box className="bg-blue-100 p-2 rounded-lg text-blue-700">
                  <Video size={24} />
                </Box>

                <Box>
                  <Text as="p" size="2" weight="bold">
                    Video
                  </Text>

                  <Text as="p" size="1">
                    MP4, MOV, WEBM, AVI
                  </Text>
                </Box>
              </Flex>
            </Card>
          </Grid>

          {/* Zona de Dropzone Visual */}
          <Box
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            hidden={isUploading}
            mt="6"
            onClick={() => imageInputRef.current?.click()}
            className="cursor-pointer"
          >
            <Flex
              direction="column"
              align="center"
              p="6"
              className="border-2 border-dashed border-gray-200 text-gray-50/30 rounded-xl hover:border-green-400  transition-all"
            >
              <UploadCloud size={32} className="text-gray-400 mb-2" />

              <p>
                {isDragging
                  ? "Suelta los archivos aquí"
                  : "Arrastra y suelta archivos aquí"}
              </p>
            </Flex>
          </Box>

          <Form.Root className="mt-4" noValidate>
            <Form.Field name="descripcion">
              <Form.Label>Descripción</Form.Label>

              <Form.Control asChild>
                <TextArea
                  value={description}
                  disabled={isUploading}
                  onChange={(e) => setDescription(e.target.value)}
                  resize="vertical"
                  maxLength={200}
                  className="max-h-36"
                />
              </Form.Control>

              <Text color="gray">
                {description.length}/{200}
              </Text>
            </Form.Field>
          </Form.Root>

          {isUploading && (
            <Flex
              direction="column"
              gap="3"
              mt="4"
              className="p-4 bg-gray-50/30 rounded-lg border border-gray-100"
            >
              <Flex align="center" gap="2">
                <Spinner size="2" />
                <Text size="2" weight="bold">
                  Subiendo publicación...
                </Text>
              </Flex>

              {/* Progreso de Imágenes */}
              {images.length > 0 && (
                <Box>
                  <Flex justify="between" mb="1">
                    <Text size="1" color="gray">
                      Imágenes ({images.length})
                    </Text>
                    <Text size="1" weight="bold">
                      {Math.round(
                        imgProgress.reduce((a, b) => a + b, 0) / images.length,
                      )}
                      %
                    </Text>
                  </Flex>
                  <ProgressBar
                    value={
                      imgProgress.reduce((a, b) => a + b, 0) / images.length
                    }
                  />
                </Box>
              )}

              {/* Progreso de Video */}
              {videos.length > 0 && (
                <Box>
                  <Flex justify="between" mb="1">
                    <Text size="1" color="gray">
                      Video
                    </Text>
                    <Text size="1" weight="bold">
                      {Math.round(vidProgress)}%
                    </Text>
                  </Flex>
                  <ProgressBar value={vidProgress} />
                </Box>
              )}
            </Flex>
          )}
        </Card>
      </Box>

      <MediaGrid files={images} onRemove={removeImage} />
      <MediaGrid files={videos} onRemove={removeVideo} />
    </div>
  );
}
