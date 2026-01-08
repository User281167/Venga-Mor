import { z } from "zod";

export const registerFormSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce un correo electrónico válido.",
  }),
  // debe tener al menos un numero, una letra mayuscula y una minuscula, y un caracter especial
  password: z
    .string()
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
      {
        message:
          "La contraseña debe tener al menos un numero, una letra mayúscula, una minúscula y un carácter especial.",
      },
    ),
  nombre: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  apellido: z.string().min(3, {
    message: "El apellido debe tener al menos 3 caracteres.",
  }),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
