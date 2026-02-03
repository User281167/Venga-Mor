import { UserCookieService } from "@/app/api/services/user-cookie.service";
import { getUserID } from "@/app/api/utils";
import { ApiResponse } from "@/lib/api-response";
import { adminDb } from "@/lib/firebase-admin-connection";

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

    const { id: colaboradorId } = await params;

    if (uid === colaboradorId) {
      return new Response(
        ApiResponse.failure("No puedes seguirte a ti mismo").toJSON(),
        { status: 403 },
      );
    }

    // refs
    const siguiendoRef = adminDb
      .collection("usuarios")
      .doc(uid)
      .collection("siguiendo")
      .doc(colaboradorId);

    const seguidorRef = adminDb
      .collection("colaboradores")
      .doc(colaboradorId)
      .collection("seguidores")
      .doc(uid);

    // ¿ya sigue?
    const alreadyFollowing = await siguiendoRef.get();

    if (alreadyFollowing.exists) {
      return new Response(
        ApiResponse.failure("Ya estás siguiendo a este colaborador").toJSON(),
        { status: 409 },
      );
    }

    // verificar colaborador existe
    const colaboradorDoc = await adminDb
      .collection("colaboradores")
      .doc(colaboradorId)
      .get();

    if (!colaboradorDoc.exists) {
      return new Response(
        ApiResponse.failure("Colaborador no encontrado").toJSON(),
        { status: 404 },
      );
    }

    // datos del usuario
    const userName = await UserCookieService.getName();
    const userPhoto = await UserCookieService.getPhoto();

    const now = new Date().toISOString();
    const batch = adminDb.batch();

    batch.set(siguiendoRef, {
      fecha: now,
      nombre: colaboradorDoc.data()?.nombre,
      avatar: colaboradorDoc.data()?.foto || "",
    });

    batch.set(seguidorRef, {
      fecha: now,
      nombre: userName,
      avatar: userPhoto || "",
    });

    batch.commit();

    return new Response(
      ApiResponse.success(null, "Seguimiento creado exitosamente").toJSON(),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al seguir:", error);

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

    if (uid === colaboradorId) {
      return new Response(ApiResponse.failure("Operación inválida").toJSON(), {
        status: 400,
      });
    }

    const siguiendoRef = adminDb
      .collection("usuarios")
      .doc(uid)
      .collection("siguiendo")
      .doc(colaboradorId);

    const seguidorRef = adminDb
      .collection("colaboradores")
      .doc(colaboradorId)
      .collection("seguidores")
      .doc(uid);

    // Verificamos que exista (opcional, pero prolijo)
    const snap = await siguiendoRef.get();

    if (!snap.exists) {
      return new Response(
        ApiResponse.failure("No estás siguiendo a este colaborador").toJSON(),
        { status: 404 },
      );
    }

    const batch = adminDb.batch();
    batch.delete(siguiendoRef);
    batch.delete(seguidorRef);

    await batch.commit();

    return new Response(
      ApiResponse.success(null, "Seguimiento eliminado").toJSON(),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al dejar de seguir:", error);
    return new Response(ApiResponse.failure("Error inesperado").toJSON(), {
      status: 500,
    });
  }
}
