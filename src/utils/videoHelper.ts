export async function getVideoMetadata(file: File): Promise<{
  width: number;
  height: number;
  duration: number;
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
    };

    video.onerror = reject;
    video.src = URL.createObjectURL(file);
  });
}

export async function generateVideoThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2); // Segundo 1 o mitad
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(video.src);
          resolve(blob);
        },
        "image/jpeg",
        0.7,
      );
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(null);
    };

    video.src = URL.createObjectURL(file);
  });
}
