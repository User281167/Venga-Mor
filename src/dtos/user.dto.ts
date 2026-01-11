import { z } from "zod";

export const UpdateUserInfoSchema = z.object({
  uid: z.string().uuid(),
  nombre: z.string().min(3).max(30),
  apellido: z.string().optional(),
  foto: z.string().url().optional(),
});

export type UpdateUserInfo = z.infer<typeof UpdateUserInfoSchema>;

export type UserDto = {
  uid: string;
  nombre: string;
  apellido?: string;
  foto?: string;
};
