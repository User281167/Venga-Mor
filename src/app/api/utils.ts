import { adminAuth } from "@/lib/firebase-admin-connection";
import { cookies } from "next/headers";
import z from "zod";

export async function getUserID(): Promise<string | null> {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return null;
  }

  const decoded = await adminAuth.verifyIdToken(token);
  const uid = decoded.uid; // Este es el uid "oficial" del usuario autenticado

  return uid;
}

export function getZodErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): string[] | null {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return parsed.error.errors.map((e) => e.message);
  }
  // if (!parsed.success) {
  //   return Object.entries(parsed.error.flatten().fieldErrors)
  //     .flatMap(([field, msgs]) => msgs?.map((msg) => `${field}: ${msg}`) ?? [])
  //     .join(", ");
  // }

  return null;
}
