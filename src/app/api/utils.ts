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

export async function isCollaborator(): Promise<boolean> {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return false;
  }

  const decoded = await adminAuth.verifyIdToken(token);
  return decoded.tipo === "colaborador";
}

export async function isVerified(): Promise<boolean> {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return false;
  }

  const decoded = await adminAuth.verifyIdToken(token);
  return decoded.verificado;
}

export function getZodErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): string[] | null {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return parsed.error.errors.map((e) => e.message);
  }

  return null;
}

export function deepTrim(obj: any): any {
  if (typeof obj === "string") return obj.trim();
  if (Array.isArray(obj)) return obj.map(deepTrim);
  if (obj && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = deepTrim(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}
