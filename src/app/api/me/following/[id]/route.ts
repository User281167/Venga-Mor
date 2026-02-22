import { getUserID } from "@/app/api/utils";
import { FollowingModel } from "@/models/follow.model";
import { ApiResponse } from "@/lib/api-response";
import { adminDb } from "@/lib/firebase-admin-connection";

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

    const { id: colaboradorId } = await params;

    if (!colaboradorId) {
      return new Response(
        ApiResponse.failure("ID de colaborador inválido").toJSON(),
        { status: 400 },
      );
    }

    const followingRef = adminDb
      .collection("usuarios")
      .doc(uid)
      .collection("siguiendo")
      .doc(colaboradorId);

    const snap = await followingRef.get();

    if (!snap.exists) {
      return new Response(
        ApiResponse.failure("No sigues a este colaborador").toJSON(),
        { status: 404 },
      );
    }

    return new Response(
      ApiResponse.success(
        {
          colaborador_id: snap.id, // opcional pero útil para el frontend
          ...snap.data(),
        } as FollowingModel,
        "Siguiendo",
      ).toJSON(),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al verificar seguimiento:", error);

    return new Response(ApiResponse.failure("Error inesperado").toJSON(), {
      status: 500,
    });
  }
}
