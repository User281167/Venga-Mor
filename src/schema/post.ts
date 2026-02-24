import { z } from "zod";

export const mediaFileSchema = z.object({
  url: z.string(),
  path: z.string(),
  name: z.string(),
});

export const postDataSchema = z.object({
  id: z.string(),
  autorId: z.string(),
  autorNombre: z.string(),
  descripcion: z
    .string()
    .max(200, "La descripción no puede exceder los 200 caracteres."),
  media: z.object({
    images: z
      .array(mediaFileSchema)
      .max(3, "Solo se permiten hasta 3 imágenes."),
    video: mediaFileSchema.nullable(),
  }),
  creado: z.string(),
  actualizado: z.string(),
});
