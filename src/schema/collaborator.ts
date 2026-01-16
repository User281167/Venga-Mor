import z from "zod";

export const collaboratorFormSchema = z.object({
  genero: z.enum(["Masculino", "Femenino", "Otro"]),
  orientacion_sexual: z
    .string()
    .nonempty("Por favor indique su orientación sexual.")
    .max(50, "La orientación sexual debe tener como máximo 50 caracteres"),
  etnia: z.enum([
    "Mestizo",
    "Blanco",
    "Indígena",
    "Negro",
    "Mulato",
    "Asiático",
  ]),
  altura: z.coerce
    .number()
    .min(0, "La altura debe ser mayor o igual a 0")
    .max(2.5, "La altura debe ser menor o igual a 2.5 metros"),
  edad: z.coerce
    .number()
    .int("Solo números enteros")
    .min(18, "La edad debe ser mayor o igual a 18 años")
    .max(100, "La edad debe ser menor o igual a 100 años")
    .default(18),
  profesion: z
    .string()
    .nonempty("Por favor indique su profesión")
    .max(50, "La profesión debe tener como máximo 50 caracteres"),
  intereses: z.array(z.string().min(3).max(50)).max(5).default([]),
  redes: z
    .array(
      z
        .string()
        .transform((v) => (v === "" ? undefined : v))
        .pipe(z.string().url("URL inválida").optional()),
    )
    .max(3)
    .transform((v) => v.filter(Boolean) as string[]),
});

export type CollaboratorInfo = z.infer<typeof collaboratorFormSchema>;
