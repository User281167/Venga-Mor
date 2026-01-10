import { registerFormSchemaWithoutPassword } from "@/app/registrarse/schema";
import { adminAuth, adminDb } from "@/lib/firebase-admin-connection";
import { ApiResponse } from "@/lib/api-response";
import { AppUser } from "@/types/user";

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

    const parsed = registerFormSchemaWithoutPassword.safeParse(userData);

    if (!parsed.success) {
      // Convertimos los errores por campo a string[]
      const errors: string[] = Object.entries(
        parsed.error.flatten().fieldErrors,
      ).flatMap(
        ([field, msgs]) => msgs?.map((msg) => `${field}: ${msg}`) ?? [],
      );

      return Response.json(ApiResponse.failure("Validación fallida", errors), {
        status: 400,
      });
    }

    const { email, nombre, apellido } = parsed.data;

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

    // Crear documento de usuario
    const userDoc = {
      id: uid,
      email,
      nombre,
      apellido,
      foto: user.foto ?? null,
      userType: "client" as const,
      creado: user.creado ?? new Date(),
      descripcion: "",
    } as AppUser;

    await adminDb.collection("usuarios").doc(uid).set(userDoc);

    return Response.json(
      ApiResponse.success(userDoc, "Usuario registrado correctamente"),
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      ApiResponse.failure("Error interno del servidor", ["Error inesperado"]),
      { status: 500 },
    );
  }
}
