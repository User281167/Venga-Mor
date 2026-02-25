import { ApiResponse } from "@/lib/api-response";
import { getUserID } from "../../utils";
import { adminDb } from "@/lib/firebase-admin-connection";
import { FollowingModel } from "@/models/follow.model";
import { PaginationDto } from "@/dtos/pagination.dto";

export async function GET(req: Request) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const lastId = searchParams.get("lastId");
    const limitParam = 10;

    let query = adminDb
      .collection("usuarios")
      .doc(uid)
      .collection("siguiendo")
      .orderBy("fecha", "desc")
      .limit(limitParam + 1); // para saber si hay más

    if (lastId) {
      const lastDoc = await adminDb
        .collection("usuarios")
        .doc(uid)
        .collection("siguiendo")
        .doc(lastId)
        .get();

      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    const docs = snapshot.docs.slice(0, limitParam);

    // Obtener datos frescos de cada colaborador en paralelo
    const colaboradoresSnaps = await Promise.all(
      docs.map((doc) => adminDb.collection("colaboradores").doc(doc.id).get()),
    );

    const data: FollowingModel[] = docs.map((doc, index) => {
      const colab = colaboradoresSnaps[index].data();
      return {
        colaborador_id: doc.id,
        fecha: doc.data().fecha,
        nombre: `${colab?.nombre ?? ""} ${colab?.apellido ?? ""}`.trim(),
        avatar: colab?.foto ?? "",
      };
    });

    const hasMore = snapshot.docs.length > limitParam;
    const newLastId = docs.length ? docs[docs.length - 1].id : null;

    const response: PaginationDto<FollowingModel> = {
      data,
      lastId: newLastId,
      total: null,
      hasMore,
    };

    return new Response(ApiResponse.success(response).toJSON(), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al obtener siguiendo:", error);

    return new Response(ApiResponse.failure("Error inesperado").toJSON(), {
      status: 500,
    });
  }
}
