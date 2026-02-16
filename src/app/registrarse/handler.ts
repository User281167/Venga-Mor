import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ApiResponse } from "@/lib/api-response";
import { registerFormSchema } from "../registrarse/schema";
import z from "zod";
import { AppUser } from "@/types/user";
import { updateFirabaseIdToken } from "@/handlers/postIdToken";
import { QueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiHelper";

async function registerUser(
  token: string,
  user: AppUser,
): Promise<ApiResponse<AppUser>> {
  await updateFirabaseIdToken(token);

  const resUser = await fetch("/api/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token, userData: user }),
  });

  // puede hacer auth pero fallar el put en store
  const resPutUser = (await resUser.json()) as ApiResponse<AppUser>;

  return ApiResponse.success(
    user,
    "Usuario creado exitosamente",
    resPutUser.errors,
  );
}

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

    const createdAtDate = res.user.metadata.creationTime
      ? new Date(res.user.metadata.creationTime)
      : null;

    const user = {
      uid: res.user.uid,
      email: res.user.email!,
      nombre: nombre,
      apellido: apellido,
      foto: null,
      tipo: "cliente",
      creado: createdAtDate ? createdAtDate.getTime() : Date.now(),
    } as AppUser;

    return await registerUser(token, user);
  } catch (error: any) {
    return ApiResponse.failure(getFirebaseAuthErrorMessage(error.code));
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

export async function onSubmitRegisterGmailUser(): Promise<
  ApiResponse<AppUser>
> {
  try {
    const provider = new GoogleAuthProvider();

    const res = await signInWithPopup(auth, provider);
    if (!res.user) return ApiResponse.failure("Error al crear usuario");

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
      tipo: "cliente",
      creado: createdAtDate ? createdAtDate.getTime() : Date.now(),
    };

    // limpiar cache
    const query = new QueryClient();
    query.clear();

    // puede que el usuario exista en AUTH pero no en firebase
    return await api.post<AppUser>("/api/usuarios/get-create", {
      idToken: token,
      userData: user,
    });
  } catch (error: any) {
    return ApiResponse.failure(getGoogleSignInErrorMessage(error.code));
  }
}
