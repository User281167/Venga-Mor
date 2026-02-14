import imageCompression from "browser-image-compression";
import lamejs from "lamejs";

export async function compressImage(
  file: File,
  fileType = "image/jpeg",
): Promise<Blob> {
  const options = {
    maxSizeMB: 1, // Tamaño máximo 1MB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: fileType,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Error compressing image:", error);
    return file;
  }
}

/* ============================================================
   AUDIO - Compresión a MP3 con lamejs
============================================================ */
export async function compressAudio(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      try {
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(
          e.target?.result as ArrayBuffer,
        );

        // Convertir a mono y reducir sample rate para comprimir
        const channels = 1;
        const sampleRate = 22050; // Reducir de 44100 a 22050
        const samples = audioBuffer.length;

        const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 96); // 96kbps
        const mp3Data: Int8Array[] = [];

        const channelData = audioBuffer.getChannelData(0);
        const sampleBlockSize = 1152;

        for (let i = 0; i < samples; i += sampleBlockSize) {
          const sampleChunk = channelData.subarray(i, i + sampleBlockSize);
          const mp3buf = mp3encoder.encodeBuffer(
            this.convertFloat32ToInt16(sampleChunk),
          );
          if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
          }
        }

        const mp3buf = mp3encoder.flush();
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }

        const blob = new Blob(mp3Data, { type: "audio/mp3" });
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
  });
}
