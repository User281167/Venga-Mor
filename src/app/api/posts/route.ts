import { ApiResponse } from "@/lib/api-response";
import { getUserID, getZodErrors } from "../utils";
import { postDataSchema } from "@/schema/post";
import { PostData } from "@/types/post";
import { adminDb } from "@/lib/firebase-admin-connection";

export async function POST(req: Request) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const { data } = await req.json();
    const errors = getZodErrors(postDataSchema, data);

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

    const postDoc: PostData = {
      ...data,
      descripcion: data.descripcion.trim(),
      autorId: uid,
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
    };

    await adminDb.collection("posts").add(postDoc);

    return new Response(
      ApiResponse.success(undefined, "Post creado exitosamente").toJSON(),
      { status: 201 },
    );
  } catch (error: any) {
    console.log("Error al obtener el colaborador:", error);

    return new Response(ApiResponse.failure("Error inesperado").toJSON(), {
      status: 500,
    });
  }
}
