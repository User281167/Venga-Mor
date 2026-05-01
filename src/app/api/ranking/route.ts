import { CollaboratorResDto } from "@/dtos/collaborator";
import { ApiResponse } from "@/lib/api-response";
import { adminDb } from "@/lib/firebase-admin-connection";
import { Collaborator } from "@/types/collaborator";
import admin from "firebase-admin";
import { getUserID } from "../utils";

const pageSize = 10;
const fetchLimit = pageSize + 1;
const orderByFields = {
  estrellas: "estrellas",
  seguidores: "seguidoresCount",
} as const;

type RankingOrderBy = keyof typeof orderByFields;

const isRankingOrderBy = (value: string | null): value is RankingOrderBy => {
  return value === "estrellas" || value === "seguidores";
};

export async function GET(req: Request) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(
        ApiResponse.failure("Usuario no autenticado").toJSON(),
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const lastId = searchParams.get("lastId");
    const orderByParam = searchParams.get("orderby");

    if (orderByParam && !isRankingOrderBy(orderByParam)) {
      return new Response(
        ApiResponse.failure("orderby inválido").toJSON(),
        { status: 400 },
      );
    }

    const orderBy: RankingOrderBy = isRankingOrderBy(orderByParam)
      ? orderByParam
      : "estrellas";

    let query: admin.firestore.Query = adminDb.collection("colaboradores");
    query = query.orderBy(orderByFields[orderBy], "desc").limit(fetchLimit);

    if (lastId) {
      const lastDoc = await adminDb
        .collection("colaboradores")
        .doc(lastId)
        .get();

      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    const data = snapshot.docs
      .slice(0, pageSize)
      .map((doc) => doc.data()) as Collaborator[];
    const lastVisible =
      data.length > 0
        ? snapshot.docs[Math.min(snapshot.docs.length, pageSize) - 1].id
        : null;

    const payload: CollaboratorResDto = {
      data,
      lastId: lastVisible,
      hasMore: snapshot.docs.length > pageSize,
    };

    return new Response(
      ApiResponse.success(payload, "Ranking obtenido").toJSON(),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al obtener ranking:", error);

    return new Response(
      ApiResponse.failure("Error al obtener ranking").toJSON(),
      { status: 500 },
    );
  }
}
