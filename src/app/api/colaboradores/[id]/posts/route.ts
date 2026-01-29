import { ApiResponse } from "@/lib/api-response";
import { PostData } from "@/types/post";
import { adminDb } from "@/lib/firebase-admin-connection";
import { PostListDto } from "@/dtos/post.dto";
import { getUserID } from "../../../utils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const autorId = (await params).id;

    if (!autorId) {
      return new Response(
        ApiResponse.failure("Autor no especificado").toJSON(),
        {
          status: 400,
        },
      );
    }

    const lastId = searchParams.get("lastId"); // El ID del último post cargado
    const limitNum = 10;

    let query = adminDb
      .collection("posts")
      .where("autorId", "==", autorId)
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
