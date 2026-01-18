import { ApiResponse } from "@/lib/api-response";
import { adminAuth, adminDb } from "@/lib/firebase-admin-connection";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(ApiResponse.failure("Datos incompletos"), {
        status: 400,
      });
    }

    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    // Verificar token Firebase
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

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

    // firebase agregar a fotos
    const fb = await adminDb
      .collection("usuarios")
      .doc(uid)
      .update({ foto: "bucket" });

    const { data: signedUrl, error: urlError } = await supabaseAdmin.storage
      .from("perfiles")
      .createSignedUrl(uid, 60);

    if (urlError)
      return new Response(ApiResponse.failure(urlError.message).toJSON(), {
        status: 500,
      });

    console.log("Imagen actualzada", signedUrl.signedUrl);

    return new Response(ApiResponse.success(signedUrl.signedUrl).toJSON());
  } catch (error) {
    console.error(error);
    return new Response(ApiResponse.failure("Error interno").toJSON(), {
      status: 500,
    });
  }
}
