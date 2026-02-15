import { z } from "zod";

export const UpdateUserInfoSchema = z.object({
  nombre: z.string().min(3).max(30),
  apellido: z.string().optional(),
  foto: z.string().url().optional().nullable(),
  descripcion: z.string().optional(),
});

export type UpdateUserInfo = z.infer<typeof UpdateUserInfoSchema>;
