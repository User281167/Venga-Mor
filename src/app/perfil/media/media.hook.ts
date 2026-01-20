import { toast } from "sonner";
import { useRef, useState } from "react";

export function useMediaUploadForm() {
  // Referencias para los inputs ocultos
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [description, setDescription] = useState<string>("");

  const [imgProgress, setImgProgress] = useState<number[]>([]);
  const [vidProgress, setVidProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const addUniques = (filesToAdd: File[]) => {
    const MAX_IMG_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_VID_SIZE = 50 * 1024 * 1024; // 50MB

    // Separar y validar archivos por tipo y tamaño
    const validImages = filesToAdd.filter((file) => {
      if (!file.type.startsWith("image/")) return false;

      if (file.size > MAX_IMG_SIZE) {
        toast.error(`${file.name} excede los 5MB`);
        return false;
      }

      return true;
    });

    const validVideos = filesToAdd.filter((file) => {
      if (!file.type.startsWith("video/")) return false;

      if (file.size > MAX_VID_SIZE) {
        toast.error(`${file.name} excede los 50MB`);
        return false;
      }

      return true;
    });

    // Procesar Imágenes (Máximo 3, Únicas por nombre)
    setImages((prev) => {
      const combined = [...prev, ...validImages];
      // Filtro de unicidad por nombre
      const unique = Array.from(
        new Map(combined.map((f) => [f.name, f])).values(),
      );

      if (unique.length > 3) {
        toast.error("Máximo 3 imágenes permitidas");
        return unique.slice(0, 3);
      }
      return unique;
    });

    // Procesar Videos (Máximo 1, Único por nombre)
    setVideos((prev) => {
      const combined = [...prev, ...validVideos];
      const unique = Array.from(
        new Map(combined.map((f) => [f.name, f])).values(),
      );

      if (unique.length > 1) {
        toast.error("Solo se permite 1 video");
        return unique.slice(0, 1);
      }

      return unique;
    });

    // Reset de inputs
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      addUniques([file]);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles: File[] = Array.from(e.dataTransfer.files);
    addUniques(droppedFiles);
  };

  return {
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

    addUniques,
    removeImage,
    removeVideo,
    handleFileChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}
