import z from "zod";
import { loginFormSchema } from "./schema";
import { ApiResponse } from "@/lib/api-response";
import { AppUser } from "@/types/user";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
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

    if (!res.user) return ApiResponse.failure("Error al iniciar sesión.");

    const token = await res.user.getIdToken();
    await fetch("/api/id-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    });

    const createdAtDate = res.user.metadata.creationTime
      ? new Date(res.user.metadata.creationTime)
      : null;

    const user = {
      uid: res.user.uid,
      email: res.user.email!,
      nombre: res.user.displayName || "",
      apellido: "",
      foto: null,
      userType: "client",
      creado: createdAtDate ? createdAtDate.getTime() : null,
    } as AppUser;

    return ApiResponse.success(user, "Sesión iniciada exitosamente.");
  } catch (error: any) {
    return ApiResponse.failure(getFirebaseLoginErrorMessage(error.code));
  }
}

function getGoogleSignInErrorMessage(code: string) {
  switch (code) {
    case "auth/popup-closed-by-user":
      return "Cerraste la ventana antes de completar el inicio de sesión.";
    case "auth/cancelled-popup-request":
      return "Ya hay una ventana de inicio de sesión abierta.";
    case "auth/popup-blocked":
      return "El navegador bloqueó la ventana emergente. Habilita los popups.";
    case "auth/network-request-failed":
      return "Error de conexión. Verifica tu internet.";
    case "auth/account-exists-with-different-credential":
      return "Este correo ya está registrado con otro método de inicio de sesión.";
    case "auth/operation-not-allowed":
      return "El inicio de sesión con Google no está habilitado.";
    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada.";
    case "auth/internal-error":
      return "Error interno de autenticación. Intenta nuevamente.";
    default:
      return "No se pudo iniciar sesión con Google. Intenta otra vez.";
  }
}

export async function onSubmitLoginGmailUser(): Promise<ApiResponse<AppUser>> {
  try {
    const provider = new GoogleAuthProvider();

    const res = await signInWithPopup(auth, provider);
    if (!res.user) return ApiResponse.failure("Error al crear usuario.");

    const token = await res.user.getIdToken();

    const createdAtDate = res.user.metadata.creationTime
      ? new Date(res.user.metadata.creationTime)
      : null;

    const user: AppUser = {
      uid: res.user.uid,
      email: res.user.email!,
      nombre: res.user.displayName || "",
      apellido: "",
      foto: res.user.photoURL,
      userType: "client",
      creado: createdAtDate ? createdAtDate.getTime() : Date.now(),
    };

    await fetch("/api/id-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    });

    return ApiResponse.success(user, "Inicio de sesión exitoso.");
  } catch (error: any) {
    return ApiResponse.failure(getGoogleSignInErrorMessage(error.code));
  }
}
