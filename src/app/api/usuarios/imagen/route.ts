import { ApiResponse } from "@/lib/api-response";
import { adminDb } from "@/lib/firebase-admin-connection";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserID, isCollaborator } from "../../utils";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(ApiResponse.failure("Archivo no enviado").toJSON(), {
        status: 400,
      });
    }

    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    // -----------------------------
    // Generar nombre único
    // -----------------------------
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${uid}-${Date.now()}.${fileExt}`;
    const filePath = `perfiles/${fileName}`;

    // -----------------------------
    // Obtener foto anterior
    // -----------------------------
    const userRef = adminDb.collection("usuarios").doc(uid);
    const userSnap = await userRef.get();
    const oldPhotoUrl = userSnap.data()?.foto as string | undefined;

    // -----------------------------
    // Subir nueva imagen
    // -----------------------------
    const { error: uploadError } = await supabaseAdmin.storage
      .from("perfiles")
      .upload(fileName, file, {
        upsert: false,
        contentType: file.type || "image/jpeg",
      });

    if (uploadError) {
      return new Response(ApiResponse.failure(uploadError.message).toJSON(), {
        status: 500,
      });
    }

    // -----------------------------
    // Obtener URL pública
    // -----------------------------
    const { data: publicData } = supabaseAdmin.storage
      .from("perfiles")
      .getPublicUrl(fileName);

    const newPhotoUrl = publicData.publicUrl;

    // -----------------------------
    // Batch Firestore
    // -----------------------------
    const batch = adminDb.batch();

    batch.update(userRef, { foto: newPhotoUrl });

    if (await isCollaborator()) {
      const colabRef = adminDb.collection("colaboradores").doc(uid);
      batch.set(colabRef, { foto: newPhotoUrl }, { merge: true });
    }

    await batch.commit();

    // -----------------------------
    // Borrar imagen anterior (opcional)
    // -----------------------------
    if (oldPhotoUrl) {
      try {
        const oldFileName = oldPhotoUrl.split("/perfiles/")[1];

        if (oldFileName) {
          await supabaseAdmin.storage.from("perfiles").remove([oldFileName]);
        }
      } catch (err) {
        console.warn("No se pudo borrar imagen anterior:", err);
      }
    }

    console.log("Imagen actualizada:", newPhotoUrl);

    return new Response(ApiResponse.success(newPhotoUrl).toJSON(), {
      status: 200,
    });
  } catch (error) {
    console.error("Error actualizando imagen:", error);
    return new Response(ApiResponse.failure("Error interno").toJSON(), {
      status: 500,
    });
  }
}
