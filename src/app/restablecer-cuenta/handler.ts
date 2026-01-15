import z from "zod";
import { ResetPasswordFormSchema } from "./schema";
import { ApiResponse } from "@/lib/api-response";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

function getFirebaseResetPasswordErrorMessage(code: string) {
  switch (code) {
    case "auth/user-not-found":
      return "No existe ninguna cuenta asociada a este correo.";
    case "auth/invalid-email":
      return "El correo ingresado no es válido.";
    case "auth/missing-email":
      return "Debes ingresar un correo electrónico.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta nuevamente más tarde.";
    case "auth/network-request-failed":
      return "Error de conexión. Verifica tu conexión a internet.";
    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada.";
    default:
      return "No se pudo enviar el correo de recuperación. Intenta nuevamente.";
  }
}

export async function onSubmitResetPassword(
  values: z.infer<typeof ResetPasswordFormSchema>,
): Promise<ApiResponse> {
  try {
    await sendPasswordResetEmail(auth, values.email);
    return ApiResponse.success(undefined, "Correo de recuperación enviado");
  } catch (error: any) {
    const message = getFirebaseResetPasswordErrorMessage(error.code);
    return ApiResponse.failure(message);
  }
}
