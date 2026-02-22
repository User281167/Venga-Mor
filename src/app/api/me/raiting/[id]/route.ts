import { getUserID } from "@/app/api/utils";
import { Raiting } from "@/models/raiting.model";
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

    const ratingId = `${colaboradorId}_${uid}`;

    const ratingRef = adminDb.collection("ratings").doc(ratingId);
    const snap = await ratingRef.get();

    if (!snap.exists) {
      return new Response(
        ApiResponse.failure("No has calificado a este colaborador").toJSON(),
        { status: 404 },
      );
    }

    const doc = (await ratingRef
      .get()
      .then((doc) => ({ id: doc.id, ...doc.data() }))) as Raiting;

    return new Response(
      ApiResponse.success(doc, "Calificación encontrada").toJSON(),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al obtener rating:", error);

    return new Response(ApiResponse.failure("Error inesperado").toJSON(), {
      status: 500,
    });
  }
}

export async function PUT(
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

    const body = await req.json();
    const valor = Number(body?.valor);

    if (!valor || valor < 1 || valor > 5) {
      return new Response(
        ApiResponse.failure("La calificación debe ser entre 1 y 5").toJSON(),
        { status: 400 },
      );
    }

    const ratingId = `${colaboradorId}_${uid}`;
    const ratingRef = adminDb.collection("ratings").doc(ratingId);

    const snap = await ratingRef.get();
    const now = new Date();

    // UPSERT
    if (!snap.exists) {
      await ratingRef.set({
        colaboradorId,
        userId: uid,
        valor,
        creado: now.toISOString(),
        actualizado: now.toISOString(),
      });

      const doc = {
        id: ratingId,
        colaboradorId,
        userId: uid,
        valor,
        creado: now.toISOString(),
        actualizado: now.toISOString(),
      } as Raiting;

      return new Response(
        ApiResponse.success(doc, "Calificación creada").toJSON(),
        { status: 201 },
      );
    }

    const prevValor = snap.data()?.valor;

    // Si no cambia el valor, evitamos write innecesario
    if (prevValor === valor) {
      const doc = { id: snap.id, ...snap.data() } as Raiting;

      return new Response(
        ApiResponse.success(doc, "La calificación no cambió").toJSON(),
        { status: 200 },
      );
    }

    await ratingRef.update({
      valor,
      actualizado: now,
    });

    const doc = {
      id: ratingId,
      ...snap.data(),
      valor,
      actualizado: now.toISOString(),
    } as Raiting;

    return new Response(
      ApiResponse.success(doc, "Calificación actualizada").toJSON(),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al guardar rating:", error);

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

    const { id: colaboradorId } = await params;

    if (!colaboradorId) {
      return new Response(
        ApiResponse.failure("ID de colaborador inválido").toJSON(),
        { status: 400 },
      );
    }

    const ratingId = `${colaboradorId}_${uid}`;
    const ratingRef = adminDb.collection("ratings").doc(ratingId);

    const snap = await ratingRef.get();

    if (!snap.exists) {
      return new Response(
        ApiResponse.failure("No existe la calificación").toJSON(),
        { status: 404 },
      );
    }

    await ratingRef.delete();

    return new Response(
      ApiResponse.success(true, "Calificación eliminada").toJSON(),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar rating:", error);

    return new Response(ApiResponse.failure("Error inesperado").toJSON(), {
      status: 500,
    });
  }
}
