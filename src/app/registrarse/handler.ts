import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ApiResponse } from "@/lib/api-response";
import { registerFormSchema } from "../registrarse/schema";
import z from "zod";
import { AppUser } from "@/lib/types";

function getFirebaseAuthErrorMessage(code: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado.";
    case "auth/invalid-email":
      return "El correo no es válido.";
    case "auth/weak-password":
      return "La contraseña es demasiado débil.";
    case "auth/network-request-failed":
      return "Error de conexión. Intenta nuevamente.";
    default:
      return "Ocurrió un error inesperado. Intenta más tarde.";
  }
}

export async function onSubmitRegisterUser(
  values: z.infer<typeof registerFormSchema>,
): Promise<ApiResponse<AppUser>> {
  try {
    const { email, password, nombre, apellido } = values;
    const res = await createUserWithEmailAndPassword(auth, email, password);

    if (!res.user) return ApiResponse.failure("Error al crear usuario");

    const token = await res.user.getIdToken();

    const user = {
      id: res.user.uid,
      email: res.user.email!,
      nombre,
      apellido,
      foto: null,
      userType: "client",
      creado: Date.now(),
    } as AppUser;

    await fetch("/api/id-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    });

    return ApiResponse.success(user, "Usuario creado exitosamente");
  } catch (error: any) {
    return ApiResponse.failure(getFirebaseAuthErrorMessage(error.code));
  }
}
