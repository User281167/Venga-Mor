import { ApiResponse } from "@/lib/api-response";
import { postDataSchema } from "@/schema/post";
import { PostData } from "@/types/post";
import { adminDb } from "@/lib/firebase-admin-connection";
import { PostListDto } from "@/dtos/post.dto";
import { getUserID, getZodErrors } from "../../utils";

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

export async function GET(req: Request) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const lastId = searchParams.get("lastId"); // El ID del último post cargado
    const limitNum = 10;

    let query = adminDb
      .collection("posts")
      .where("autorId", "==", uid)
      .orderBy("creado", "desc") // Siempre ordena por fecha
      .limit(limitNum);

    // Si el cliente envía el ID del último post, empezamos después de ese
    if (lastId) {
      const lastDoc = await adminDb.collection("posts").doc(lastId).get();

      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();

    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Enviamos el ID del último para que el front sepa de dónde seguir
    const lastVisible =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

    const data: PostListDto = {
      data: posts as PostData[],
      lastId: lastVisible,
      total: snapshot.size,
      hasMore: snapshot.docs.length === limitNum,
    };

    return new Response(ApiResponse.success<PostListDto>(data).toJSON(), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al obtener posts:", error);

    return new Response(
      ApiResponse.failure("Error al obtener posts").toJSON(),
      {
        status: 500,
      },
    );
  }
}
