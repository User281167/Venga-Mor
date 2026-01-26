import { ApiResponse } from "@/lib/api-response";
import { getUserID } from "../../utils";
import { adminDb } from "@/lib/firebase-admin-connection";
import { CollaboratorInfo } from "@/schema/collaborator";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const uid = await getUserID();

    if (!uid)
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });

    const { id } = await params;

    const userDoc = await adminDb.collection("colaboradores").doc(id).get();
    const user = userDoc.data() as CollaboratorInfo;

    if (!userDoc.exists) {
      return new Response(
        ApiResponse.failure("Colaborador no encontrado").toJSON(),
        { status: 404 },
      );
    }

    return new Response(
      ApiResponse.success(user, "Colaborador obtenido").toJSON(),
      { status: 200 },
    );
  } catch (error: any) {
    console.log("Error al obtener el colaborador:", error);

    return new Response(
      ApiResponse.failure(error.message || "Error inesperado").toJSON(),
      { status: 500 },
    );
  }
}
