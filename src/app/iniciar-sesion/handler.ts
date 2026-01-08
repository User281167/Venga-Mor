import z from "zod";
import { loginFormSchema } from "./schema";
import { ApiResponse } from "@/lib/api-response";
import { AppUser } from "@/lib/types";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

function getFirebaseLoginErrorMessage(code: string) {
  switch (code) {
    case "auth/user-not-found":
      return "No existe una cuenta con este correo.";
    case "auth/wrong-password":
      return "La contraseña es incorrecta.";
    case "auth/invalid-email":
      return "El correo no es válido.";
    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada.";
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Intenta más tarde.";
    case "auth/network-request-failed":
      return "Error de conexión. Verifica tu internet.";
    case "auth/invalid-credential":
      return "Las credenciales son incorrectas.";
    default:
      return "Error al iniciar sesión. Intenta nuevamente.";
  }
}

export async function onSubmitLoginUser(
  values: z.infer<typeof loginFormSchema>,
): Promise<ApiResponse<AppUser>> {
  try {
    const { email, password } = values;
    const res = await signInWithEmailAndPassword(auth, email, password);

    if (!res.user) return ApiResponse.failure("Error al iniciar sesion");

    const token = await res.user.getIdToken();
    await fetch("/api/id-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    });

    const user = {
      id: res.user.uid,
      email: res.user.email!,
      nombre: res.user.displayName || "",
      apellido: "",
      foto: null,
      userType: "client",
      creado: Date.now(),
    } as AppUser;

    return ApiResponse.success(user, "Sesión iniciada exitosamente");
  } catch (error: any) {
    return ApiResponse.failure(getFirebaseLoginErrorMessage(error.code));
  }
}
