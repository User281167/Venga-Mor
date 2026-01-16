import { adminAuth, adminDb } from "@/lib/firebase-admin-connection";
import { ApiResponse } from "@/lib/api-response";
import { UpdateUserInfoSchema, UserDto } from "@/dtos/user.dto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/subase";
import { getUserID, getZodErrors } from "../utils";
import { collaboratorFormSchema } from "@/schema/collaborator";

export async function POST(req: Request) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const { data } = await req.json();
    const errors = getZodErrors(collaboratorFormSchema, data);

    if (!!errors) {
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

    const plainData = JSON.parse(JSON.stringify(data)); // Elimina propiedades no serializables
    await adminDb.collection("colaboradores").doc(uid).create(plainData);

    return new Response(
      ApiResponse.success(data, "Cuenta de colaborador creada").toJSON(),
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return new Response(
      ApiResponse.failure("No se pudo crear la cuenta", [
        "Error inesperado",
      ]).toJSON(),
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
