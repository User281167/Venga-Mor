import { z } from "zod";

export const setInfoFormSchema = z.object({
  nombre: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  apellido: z.string().min(3, {
    message: "El apellido debe tener al menos 3 caracteres.",
  }),
  descripcion: z
    .string()
    .max(50, {
      message: "La descripción debe tener máximo 50 caracteres.",
    })
    .optional(),
});
