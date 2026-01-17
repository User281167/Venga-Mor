import { registerFormSchemaWithoutPassword } from "@/app/registrarse/schema";
import { adminAuth, adminDb } from "@/lib/firebase-admin-connection";
import { ApiResponse } from "@/lib/api-response";
import { AppUser } from "@/types/user";
import { UpdateUserInfoSchema, UserDto } from "@/dtos/user.dto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/subase";

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
      uid: uid,
      email,
      nombre,
      apellido,
      foto: user.foto ?? null,
      tipo: "client" as const,
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

export async function PUT(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid; // Este es el uid "oficial" del usuario autenticado

    const body = await req.json();
    const parsed = UpdateUserInfoSchema.safeParse(body);

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

    const { nombre, apellido, foto, descripcion } = parsed.data;

    // Actualizar los datos en Firestore
    await adminDb
      .collection("usuarios")
      .doc(uid)
      .update({
        nombre,
        apellido,
        foto: foto || null,
        descripcion: descripcion || null,
      });

    return new Response(
      ApiResponse.success("Usuario actualizado exitosamente.").toJSON(),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return new Response(
      ApiResponse.failure(
        "Error inesperado al actualizar la información.",
      ).toJSON(),
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // Tomamos el token del usuario desde la cookie
    const token = (await cookies()).get("token")?.value;

    if (!token)
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });

    // Verificamos el token con Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Obtenemos el documento de Firestore del usuario
    const userDoc = await adminDb.collection("usuarios").doc(uid).get();

    const user: UserDto = userDoc.data() as UserDto;

    if (!userDoc.exists) {
      return new Response(
        ApiResponse.failure("Usuario no encontrado").toJSON(),
        { status: 404 },
      );
    }

    // buscar en supabase
    if (user.foto === "bucket") {
      const { data: signedUrl } = await supabaseAdmin.storage
        .from("perfiles")
        .createSignedUrl(uid, 60);

      if (signedUrl) {
        user.foto = signedUrl.signedUrl;
      } else {
        user.foto =
          "https://pixabay.com/images/download/false-2061132_1920.png";
      }
    }

    return new Response(
      ApiResponse.success(user, "Usuario obtenido").toJSON(),
      { status: 200 },
    );
  } catch (error: any) {
    return new Response(
      ApiResponse.failure(error.message || "Error inesperado").toJSON(),
      { status: 500 },
    );
  }
}
