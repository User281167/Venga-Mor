import { getUserID } from "@/app/api/utils";
import { ApiResponse } from "@/lib/api-response";
import { adminDb } from "@/lib/firebase-admin-connection";
import { CommentModel } from "@/types/comment";

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

    const { id } = await params;

    // Obtener el comentario del usuario actual
    const myCommentSnapshot = await adminDb
      .collection("comentarios")
      .where("colaborador_id", "==", id)
      .where("usuario_id", "==", uid)
      .orderBy("fecha", "desc")
      .limit(1)
      .get();

    const myComment = myCommentSnapshot.empty
      ? null
      : ({
          id: myCommentSnapshot.docs[0].id,
          ...myCommentSnapshot.docs[0].data(),
        } as CommentModel);

    return new Response(
      ApiResponse.success(
        myComment,
        "Comentario del usuario obtenido",
      ).toJSON(),
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error al obtener mi comentario:", error);
    return new Response(ApiResponse.failure("Error inesperado").toJSON(), {
      status: 500,
    });
  }
}

export async function DELETE(
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

    const { id } = await params;

    // Obtener el comentario del usuario actual
    const snapshot = await adminDb
      .collection("comentarios")
      .where("colaborador_id", "==", id)
      .where("usuario_id", "==", uid)
      .orderBy("fecha", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return new Response(
        ApiResponse.failure("No se encontró ningún comentario").toJSON(),
        { status: 404 },
      );
    }

    const batch = adminDb.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return new Response(
      ApiResponse.success(undefined, "Comentario eliminado").toJSON(),
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error("Error al eliminar comentario:", error);

    return new Response(ApiResponse.failure("Error inesperado").toJSON(), {
      status: 500,
    });
  }
}
