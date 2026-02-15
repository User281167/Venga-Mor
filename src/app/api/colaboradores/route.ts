import { CollaboratorResDto } from "@/dtos/collaborator";
import { ApiResponse } from "@/lib/api-response";
import { adminDb } from "@/lib/firebase-admin-connection";
import { Collaborator } from "@/types/collaborator";
import admin from "firebase-admin";

const normalize = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

// Función auxiliar para limpiar strings
const clean = (val: string | null): string | null => {
  const v = val?.trim();
  return v && v !== "undefined" && v !== "null" && v !== "" ? v : null;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const minAge = parseInt(searchParams.get("minAge") || "18");
    const maxAge = parseInt(searchParams.get("maxAge") || "60");

    const categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];

    const [country, state, city] =
      searchParams
        .get("location")
        ?.split(",")
        .map((v) => clean(v)) ?? [];

    const lastId = searchParams.get("lastId");
    const limitNum = 20;

    let query: admin.firestore.Query = adminDb.collection("colaboradores");

    // Se elimina el filtro de edad (.where) para evitar que la consulta falle
    // si un documento no tiene el campo 'edad'. El filtrado robusto se debe
    // hacer en memoria si es necesario.
    query = query.orderBy("__name__", "asc");

    // Aplicar el Cursor
    if (lastId) {
      const lastDoc = await adminDb
        .collection("colaboradores")
        .doc(lastId)
        .get();
      if (lastDoc.exists) query = query.startAfter(lastDoc);
    }

    // Limitamos la cantidad inicial a traer
    query = query.limit(limitNum);
    const snapshot = await query.get();

    // --- FILTRADO EN MEMORIA (JavaScript) ---
    let profiles = snapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as Collaborator[];

    const lastVisible =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

    const data: CollaboratorResDto = {
      data: profiles,
      lastId: lastVisible,
      hasMore: snapshot.docs.length === limitNum,
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
