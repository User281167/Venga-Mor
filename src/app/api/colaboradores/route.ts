import { CollaboratorResDto } from "@/dtos/collaborator";
import { ApiResponse } from "@/lib/api-response";
import { adminDb } from "@/lib/firebase-admin-connection";
import { Collaborator } from "@/types/collaborator";
import admin from "firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lastId = searchParams.get("lastId");
    const limitNum = 20;

    let query: admin.firestore.Query = adminDb.collection("colaboradores");

    // Order by name to be able to use startAfter for pagination
    query = query.orderBy("__name__");

    if (lastId) {
      const lastDoc = await adminDb
        .collection("colaboradores")
        .doc(lastId)
        .get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.limit(limitNum).get();

    const profiles = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...(doc.data() as Omit<Collaborator, "uid">),
    })) as Collaborator[];

    const lastVisible =
      profiles.length > 0 ? profiles[profiles.length - 1].uid : null;

    const data: CollaboratorResDto = {
      data: profiles,
      lastId: lastVisible,
      hasMore: profiles.length === limitNum,
    };

    return new Response(ApiResponse.success(data).toJSON(), { status: 200 });
  } catch (error: any) {
    console.error("Error en perfiles:", error);
    return new Response(
      ApiResponse.failure("Error al obtener perfiles").toJSON(),
      { status: 500 },
    );
  }
}
