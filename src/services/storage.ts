import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "@/lib/firebase";

import { generateVideoThumbnail, getVideoMetadata } from "@/utils/videoHelper";
import { compressAudio, compressImage } from "@/utils/compressor";
import { getImageDimensions } from "@/utils/imageHelper";
import { getAudioDuration } from "@/utils/audioHelper";

import { ChatMediaMetadata, MessageType } from "@/types/chat.type";
import { BusinessError } from "@/errors/errors";

export interface UploadResult {
  url: string;
  metadata: ChatMediaMetadata;
  thumbnailUrl?: string;
}

export class StorageService {
  static async uploadImage(
    chatId: string,
    messageId: string,
    file: File,
  ): Promise<UploadResult> {
    // Validar tamaño (max 10MB antes de comprimir)
    if (file.size > 10 * 1024 * 1024) {
      throw new BusinessError("La imagen no puede superar 10MB");
    }

    // ej image/jpeg
    const mimeType = file.type.split("/")[1];
    const type = mimeType.split("/")[0];

    // Comprimir
    const compressedBlob = await compressImage(file, mimeType);

    // Subir
    const timestamp = Date.now();
    const storageRef = ref(
      storage,
      `chats/${chatId}/images/${messageId}_${timestamp}.${type}`,
    );

    await uploadBytes(storageRef, compressedBlob);
    const url = await getDownloadURL(storageRef);

    // Obtener dimensiones
    const dimensions = await getImageDimensions(
      URL.createObjectURL(compressedBlob),
    );

    return {
      url,
      metadata: {
        size: compressedBlob.size,
        mimeType: mimeType,
        width: dimensions.width,
        height: dimensions.height,
        duration: null,
        fileName: file.name,
        thumbnailUrl: null,
      },
    };
  }

  /* ============================================================
     VIDEOS - Compresión simple (sin FFmpeg, solo límite de tamaño)
  ============================================================ */
  static async uploadVideo(
    chatId: string,
    messageId: string,
    file: File,
  ): Promise<UploadResult> {
    // Validar tamaño (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      throw new BusinessError("El video no puede superar 50MB");
    }

    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "mp4";
    const storageRef = ref(
      storage,
      `chats/${chatId}/videos/${messageId}_${timestamp}.${extension}`,
    );

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // Obtener duración y dimensiones
    const videoData = await getVideoMetadata(file);

    // Generar thumbnail
    const thumbnail = await generateVideoThumbnail(file);
    let thumbnailUrl: string | undefined;

    if (thumbnail) {
      const thumbRef = ref(
        storage,
        `chats/${chatId}/videos/${messageId}_${timestamp}_thumb.jpg`,
      );

      await uploadBytes(thumbRef, thumbnail);
      thumbnailUrl = await getDownloadURL(thumbRef);
    }

    return {
      url,
      thumbnailUrl,
      metadata: {
        size: file.size,
        mimeType: file.type,
        fileName: file.name,
        width: videoData.width,
        height: videoData.height,
        duration: videoData.duration,
        thumbnailUrl: thumbnailUrl || null,
      },
    };
  }

  static async uploadAudio(
    chatId: string,
    messageId: string,
    file: File,
  ): Promise<UploadResult> {
    // Validar tamaño (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      throw new BusinessError("El audio no puede superar 20MB");
    }

    let uploadBlob: Blob = file;
    let mimeType = file.type;

    // Comprimir solo si es necesario
    if (file.size > 1 * 1024 * 1024) {
      // > 1MB
      try {
        uploadBlob = await compressAudio(file);
        mimeType = "audio/mp3";
      } catch (error) {
        console.error("Error compressing audio, using original:", error);
      }
    }

    const timestamp = Date.now();
    const extension = mimeType.includes("mp3") ? "mp3" : "m4a";
    const storageRef = ref(
      storage,
      `chats/${chatId}/audio/${messageId}_${timestamp}.${extension}`,
    );

    await uploadBytes(storageRef, uploadBlob);
    const url = await getDownloadURL(storageRef);

    // Obtener duración
    const duration = await getAudioDuration(file);

    return {
      url,
      metadata: {
        size: uploadBlob.size,
        mimeType,
        fileName: file.name,
        duration,
        height: null,
        width: null,
        thumbnailUrl: null,
      },
    };
  }

  /* ============================================================
     ARCHIVOS - Sin compresión
  ============================================================ */
  static async uploadFile(
    chatId: string,
    messageId: string,
    file: File,
  ): Promise<UploadResult> {
    // Validar tamaño (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      throw new BusinessError("El archivo no puede superar 25MB");
    }

    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "bin";
    const storageRef = ref(
      storage,
      `chats/${chatId}/files/${messageId}_${timestamp}.${extension}`,
    );

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return {
      url,
      metadata: {
        size: file.size,
        mimeType: file.type,
        fileName: file.name,
        height: null,
        width: null,
        duration: null,
        thumbnailUrl: null,
      },
    };
  }

  static async deleteMedia(mediaUrl: string): Promise<void> {
    try {
      const mediaRef = ref(storage, mediaUrl);
      await deleteObject(mediaRef);
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  }

  /* ============================================================
     DETECTOR DE TIPO DE ARCHIVO
  ============================================================ */
  static detectFileType(file: File): MessageType {
    const type = file.type;

    if (type.startsWith("image/")) return "image";
    if (type.startsWith("video/")) return "video";
    if (type.startsWith("audio/")) return "audio";

    return "file";
  }
}
