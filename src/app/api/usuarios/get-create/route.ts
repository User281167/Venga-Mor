import { registerFormSchemaWithoutPassword } from "@/app/registrarse/schema";
import { adminAuth, adminDb } from "@/lib/firebase-admin-connection";
import { ApiResponse } from "@/lib/api-response";
import { AppUser } from "@/types/user";
import { UserCookieService } from "../../services/user-cookie.service";
import { getZodErrors, setUserRoleClaims } from "../../utils";
import { USER_ROLES } from "../../constants/user-roles";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idToken, userData } = body;
    const user = userData as AppUser;

    if (!idToken || !userData) {
      return Response.json(ApiResponse.failure("Datos incompletos"), {
        status: 400,
      });
    }

    const errors = getZodErrors(registerFormSchemaWithoutPassword, userData);

    if (!!errors) {
      console.log("Datos recibidos para el nuevo perfil:", userData);
      console.log("Errores de validación:", errors);

      return new Response(
        ApiResponse.failure(
          "Datos incompletos o erroneos",
          errors ?? [],
        ).toJSON(),
        {
          status: 400,
        },
      );
    }

    const { email, nombre, apellido } = user;

    // Verificar token Firebase
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // Seguridad extra: email debe coincidir
    if (decoded.email !== email) {
      return Response.json(
        ApiResponse.failure("El email no coincide con el usuario autenticado", [
          "Email del token no coincide con el proporcionado",
        ]),
        { status: 403 },
      );
    }

    // Obtenemos el documento de Firestore del usuario
    const userDoc = await adminDb
      .collection("usuarios")
      .doc(userData.uid)
      .get();

    if (userDoc.exists) {
      // guardar en cookies
      await UserCookieService.setName(user.nombre + " " + user.apellido);

      return new Response(
        ApiResponse.success(
          userDoc.data() as AppUser,
          "Inicio de sesión",
        ).toJSON(),
        {
          status: 200,
        },
      );
    }

    // Crear documento de usuario
    const newUserDoc = {
      uid: uid,
      email: email.trim(),
      nombre: nombre.trim(),
      apellido: apellido?.trim(),
      foto: user.foto ?? null,
      tipo: "cliente" as const,
      creado: user.creado
        ? new Date(user.creado).toISOString()
        : new Date().toISOString(),
      descripcion: "",
    } as AppUser;

    // guardar en cookies
    // cambiar claims
    await Promise.all([
      UserCookieService.setName(user.nombre + " " + user.apellido),
      adminDb.collection("usuarios").doc(uid).set(newUserDoc),
      setUserRoleClaims(uid, USER_ROLES.CLIENT),
    ]);

    return Response.json(
      ApiResponse.success(newUserDoc, "Usuario registrado correctamente"),
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      ApiResponse.failure("Error interno del servidor", ["Error inesperado"]),
      { status: 500 },
    );
  }
}
