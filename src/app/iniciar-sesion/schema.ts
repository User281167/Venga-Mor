import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce un correo electrónico válido.",
  }),
  password: z.string().min(1, {
    message: "Campo requerido.",
  }),
});
