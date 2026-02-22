import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ApiResponse } from "@/lib/api-response";
import { db, storage } from "@/lib/firebase";
import { MediaFile, PostData } from "@/types/post";

// Tipo para el callback de progreso
type ProgressCallback = (progress: number) => void;

export const uploadFileResumable = (
  file: File,
  userId: string,
  postId: string,
  folder: "images" | "videos",
  onProgress?: ProgressCallback,
): Promise<MediaFile> => {
  return new Promise((resolve, reject) => {
    const storagePath = `${folder}/${userId}/${postId}/${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          url: downloadUrl,
          path: storagePath,
          name: file.name,
        });
      },
    );
  });
};

export async function createMediaPost(
  userId: string,
  description: string,
  images: File[],
  videos: File[],
  onImageProgress?: (progress: number[]) => void, // Un array de progreso para cada imagen
  onVideoProgress?: (progress: number) => void,
): Promise<ApiResponse> {
  try {
    const postRef = doc(collection(db, "posts"));
    const postId = postRef.id;

    // Estado local para trackear progreso de múltiples imágenes
    const imgProgressArray = new Array(images.length).fill(0);

    const imageUploadPromises = images.map((img, index) =>
      uploadFileResumable(img, userId, postId, "images", (p) => {
        imgProgressArray[index] = p;
        if (onImageProgress) onImageProgress([...imgProgressArray]);
      }),
    );

    const videoUploadPromise =
      videos.length > 0
        ? uploadFileResumable(
            videos[0],
            userId,
            postId,
            "videos",
            onVideoProgress,
          )
        : Promise.resolve(null);

    const [uploadedImages, uploadedVideo] = await Promise.all([
      Promise.all(imageUploadPromises),
      videoUploadPromise,
    ]);

    const postData: PostData = {
      id: postId,
      autorId: userId,
      descripcion: description.trim().slice(0, 200),
      media: {
        images: uploadedImages,
        video: uploadedVideo,
      },
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      randomSeed: Math.random(), // Para orden aleatorio en el feed
    };

    const response = await fetch("/api/colaborador/posts/", {
      method: "POST",
      body: JSON.stringify({ data: postData }),
      headers: { "Content-Type": "application/json" },
    });

    return (await response.json()) as ApiResponse;
  } catch (error: any) {
    console.error("Error en createMediaPost:", error);

    if (error?.code === "storage/unauthorized") {
      return ApiResponse.failure(
        "No tienes permisos de colaborador para subir archivos.",
      );
    }

    return ApiResponse.failure("Error inesperado al subir archivos.");
  }
}
