import { ApiResponse } from "@/lib/api-response";
import { adminDb } from "@/lib/firebase-admin-connection";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserID, isCollaborator } from "../../utils";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(ApiResponse.failure("Datos incompletos"), {
        status: 400,
      });
    }

    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const { data, error } = await supabaseAdmin.storage
      .from("perfiles")
      .upload(`${uid}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error)
      return new Response(ApiResponse.failure(error.message).toJSON(), {
        status: 500,
      });

    const { data: signedUrl } = supabaseAdmin.storage
      .from("perfiles")
      .getPublicUrl(uid);

    // --- SINCRONIZACIÓN CON BATCH ---
    const batch = adminDb.batch();

    const userRef = adminDb.collection("usuarios").doc(uid);
    batch.update(userRef, { foto: signedUrl.publicUrl });

    if (await isCollaborator()) {
      console.log("Colaborador");
      const colabRef = adminDb.collection("colaboradores").doc(uid);

      batch.set(
        colabRef,
        {
          foto: signedUrl.publicUrl,
        },
        { merge: true },
      );
    }

    await batch.commit();
    console.log("Imagen actualzada", signedUrl.publicUrl);

    const imageUrl = `${signedUrl.publicUrl}?v=${Date.now()}`;

    return new Response(ApiResponse.success(imageUrl).toJSON());
  } catch (error) {
    console.error(error);
    return new Response(ApiResponse.failure("Error interno").toJSON(), {
      status: 500,
    });
  }
}
