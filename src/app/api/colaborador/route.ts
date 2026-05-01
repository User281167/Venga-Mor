import { adminDb } from "@/lib/firebase-admin-connection";
import { ApiResponse } from "@/lib/api-response";
import { deepTrim, getUserID, getZodErrors, setUserRoleClaims } from "../utils";
import {
  collaboratorFormSchema,
  CollaboratorInfo,
} from "@/schema/collaborator";
import { Collaborator } from "@/types/collaborator";
import { AppUser } from "@/types/user";
import { USER_ROLES } from "../constants/user-roles";

export async function POST(req: Request) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const { data } = await req.json();
    const errors = getZodErrors(collaboratorFormSchema, data);

    if (!!errors) {
      console.error("Errores de validación:", errors);

      return new Response(
        ApiResponse.failure(
          "Datos incompletos o erroneos",
          errors ?? [],
        ).toJSON(),
        {
          status: 400,
        },
      );
    }

    const userRef = adminDb.collection("usuarios").doc(uid);
    const user = (await userRef.get()).data() as AppUser;

    // Elimina propiedades no serializables
    const plainData = JSON.parse(
      JSON.stringify(
        deepTrim({
          ...data,
          estrellas: 0,
          seguidoresCount: 0,
          comentariosCount: 0,
          uid: user.uid,
          nombre: user.nombre,
          apellido: user.apellido,
          descripcion: user.descripcion,
          foto: user.foto,
        } as Collaborator),
      ),
    );
    const task1 = adminDb
      .collection("colaboradores")
      .doc(uid)
      .create(plainData);

    const task2 = userRef.update({ tipo: "colaborador" });
    const task3 = setUserRoleClaims(uid, USER_ROLES.COLLABORATOR);

    await Promise.all([task1, task2, task3]);

    return new Response(
      ApiResponse.success(data, "Cuenta de colaborador creada").toJSON(),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al crear la cuenta de colaborador:", error);

    return new Response(
      ApiResponse.failure("No se pudo crear la cuenta", [
        "Error inesperado",
      ]).toJSON(),
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const { data } = await req.json();
    const errors = getZodErrors(collaboratorFormSchema, data);

    if (!!errors) {
      console.error("Errores de validación:", errors);

      return new Response(
        ApiResponse.failure(
          "Datos incompletos o erroneos",
          errors ?? [],
        ).toJSON(),
        {
          status: 400,
        },
      );
    }

    const plainData = JSON.parse(JSON.stringify(deepTrim(data)));

    // Actualizar los datos en Firestore
    await adminDb.collection("colaboradores").doc(uid).update(plainData);

    return new Response(
      ApiResponse.success(
        data,
        "Información actualizada exitosamente.",
      ).toJSON(),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al actualizar el colaborador:", error);

    return new Response(
      ApiResponse.failure(
        "Error inesperado al actualizar la información.",
      ).toJSON(),
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const uid = await getUserID();

    if (!uid)
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });

    const userDoc = await adminDb.collection("colaboradores").doc(uid).get();
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
