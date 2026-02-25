import { FollowerModel } from "@/models/follow.model";
import { PaginationDto } from "@/dtos/pagination.dto";
import { ApiResponse } from "@/lib/api-response";
import { adminDb } from "@/lib/firebase-admin-connection";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: colaboradorId } = await params;

    if (!colaboradorId) {
      return new Response(
        ApiResponse.failure("ID de colaborador inválido").toJSON(),
        { status: 400 },
      );
    }

    const { searchParams } = new URL(req.url);
    const lastId = searchParams.get("lastId");
    const limitParam = 5;

    let query = adminDb
      .collection("colaboradores")
      .doc(colaboradorId)
      .collection("seguidores")
      .orderBy("fecha", "desc")
      .limit(limitParam + 1); // +1 para hasMore

    if (lastId) {
      const lastDoc = await adminDb
        .collection("colaboradores")
        .doc(colaboradorId)
        .collection("seguidores")
        .doc(lastId)
        .get();

      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    const docs = snapshot.docs.slice(0, limitParam);

    const [colaboradorDoc, ...usuariosSnaps] = await Promise.all([
      adminDb.collection("colaboradores").doc(colaboradorId).get(),
      ...docs.map((doc) => adminDb.collection("usuarios").doc(doc.id).get()),
    ]);

    const data: FollowerModel[] = docs.map((doc, index) => {
      const usuario = usuariosSnaps[index].data();
      return {
        usuario_id: doc.id,
        fecha: doc.data().fecha,
        nombre: `${usuario?.nombre ?? ""} ${usuario?.apellido ?? ""}`.trim(),
        avatar: usuario?.foto ?? "",
      };
    });

    const total = colaboradorDoc.data()?.followers_count ?? data.length;

    const hasMore = snapshot.docs.length > limitParam;
    const newLastId = docs.length ? docs[docs.length - 1].id : null;

    const response: PaginationDto<FollowerModel> = {
      data,
      lastId: newLastId,
      total,
      hasMore,
    };

    return new Response(ApiResponse.success(response).toJSON(), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al obtener seguidores:", error);

    return new Response(ApiResponse.failure("Error inesperado").toJSON(), {
      status: 500,
    });
  }
}
