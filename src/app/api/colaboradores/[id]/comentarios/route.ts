import { UserCookieService } from "@/app/api/services/user-cookie.service";
import { getUserID } from "@/app/api/utils";
import { CommentsDto } from "@/dtos/comments.dto";
import { ApiResponse } from "@/lib/api-response";
import { adminDb } from "@/lib/firebase-admin-connection";
import { CommentModel } from "@/types/comment";

export async function POST(
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

    const { content } = await req.json();
    const trimContent: string = content?.trim().slice(0, 200) ?? "";

    if (!trimContent) {
      return new Response(
        ApiResponse.failure("El contenido no puede estar vacío").toJSON(),
        { status: 400 },
      );
    }

    const { id } = await params;

    const existingCommentSnap = await adminDb
      .collection("comentarios")
      .where("colaborador_id", "==", id)
      .where("usuario_id", "==", uid)
      .limit(1)
      .get();

    if (!existingCommentSnap.empty) {
      return new Response(
        ApiResponse.failure("Ya has comentado en este colaborador").toJSON(),
        { status: 409 }, // Conflict
      );
    }

    if (id === uid) {
      return new Response(
        ApiResponse.failure("No puedes comentar en tu propio perfil").toJSON(),
        { status: 403 }, // Forbidden
      );
    }

    // Verificar que el colaborador existe
    const colaboradorDoc = await adminDb
      .collection("colaboradores")
      .doc(id)
      .get();

    if (!colaboradorDoc.exists) {
      return new Response(
        ApiResponse.failure("Colaborador no encontrado").toJSON(),
        { status: 404 },
      );
    }

    const userName = await UserCookieService.getName();

    if (!userName) {
      return new Response(
        ApiResponse.failure(
          "No se pudo obtener el nombre del usuario",
        ).toJSON(),
        { status: 400 },
      );
    }

    const commentDoc: CommentModel = {
      id: adminDb.collection("comentarios").doc().id,
      colaborador_id: id,
      fecha: new Date().toISOString(),
      usuario_id: uid,
      usuario_nombre: userName,
      contenido: trimContent,
    };

    await adminDb.collection("comentarios").add(commentDoc);

    return new Response(
      ApiResponse.success(
        commentDoc,
        "Comentario creado exitosamente",
      ).toJSON(),
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error al crear el comentario:", error);
    return new Response(ApiResponse.failure("Error inesperado").toJSON(), {
      status: 500,
    });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // return new Response(ApiResponse.failure("No encontrado TEST").toJSON(), {
  //   status: 404,
  // });

  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const colaboradorId = (await params).id;

    if (!colaboradorId) {
      return new Response(
        ApiResponse.failure("Autor no especificado").toJSON(),
        {
          status: 400,
        },
      );
    }

    const lastId = searchParams.get("lastId"); // El ID del último comentario cargado
    const limitNum = 5;

    let query = adminDb
      .collection("comentarios")
      .where("colaborador_id", "==", colaboradorId)
      .orderBy("fecha", "desc") // Siempre ordena por fecha
      .limit(limitNum);

    // Si el cliente envía el ID del último comentario, empezamos después de ese
    if (lastId) {
      const lastDoc = await adminDb.collection("comentarios").doc(lastId).get();

      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();

    const comentarios = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Enviamos el ID del último para que el front sepa de dónde seguir
    const lastVisible =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

    const data: CommentsDto = {
      data: comentarios as CommentModel[],
      lastId: lastVisible,
      total: snapshot.size,
      hasMore: snapshot.docs.length === limitNum,
    };

    return new Response(ApiResponse.success<CommentsDto>(data).toJSON(), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al obtener los comentairos:", error);

    return new Response(
      ApiResponse.failure("Error al obtener los comentarios").toJSON(),
      {
        status: 500,
      },
    );
  }
}
