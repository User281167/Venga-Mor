export interface MediaFile {
  url: string;
  path: string;
  name: string;
}

export interface PostData {
  id: string;
  autorId: string;
  descripcion: string;
  media: {
    images: MediaFile[];
    video: MediaFile | null;
  };
  creado: number;
  actualizado: number;
}
