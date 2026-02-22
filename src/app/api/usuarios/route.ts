import { registerFormSchemaWithoutPassword } from "@/app/registrarse/schema";
import { adminAuth, adminDb } from "@/lib/firebase-admin-connection";
import { ApiResponse } from "@/lib/api-response";
import { AppUser } from "@/types/user";
import { UpdateUserInfoSchema, UserDto } from "@/dtos/user.dto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { getZodErrors } from "../utils";
import { UserCookieService } from "../services/user-cookie.service";
import admin from "firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idToken, userData } = body;
    const user = userData as AppUser;

    if (!idToken || !userData) {
      return Response.json(ApiResponse.failure("Datos incompletos"), {
        status: 400,
      });
    }

    const parsed = registerFormSchemaWithoutPassword.safeParse(userData);

    if (!parsed.success) {
      // Convertimos los errores por campo a string[]
      const errors: string[] = Object.entries(
        parsed.error.flatten().fieldErrors,
      ).flatMap(
        ([field, msgs]) => msgs?.map((msg) => `${field}: ${msg}`) ?? [],
      );

      return Response.json(ApiResponse.failure("Validación fallida", errors), {
        status: 400,
      });
    }

    const { email, nombre, apellido } = parsed.data;

    // Verificar token Firebase
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // Seguridad extra: email debe coincidir
    if (decoded.email !== email) {
      return Response.json(
        ApiResponse.failure("El email no coincide con el usuario autenticado", [
          "Email del token no coincide con el proporcionado",
        ]),
        { status: 403 },
      );
    }

    // Crear documento de usuario
    const userDoc = {
      uid: uid,
      email: email.trim(),
      nombre: nombre.trim(),
      apellido: apellido?.trim(),
      foto: user.foto ?? null,
      tipo: "cliente" as const,
      creado: user.creado ?? new Date(),
      descripcion: "",
    } as AppUser;

    // guardar en cookies
    await UserCookieService.setName(user.nombre + " " + user.apellido);
    await adminDb.collection("usuarios").doc(uid).set(userDoc);

    // cambiar claims
    await admin.auth().setCustomUserClaims(uid, { role: "cliente" });

    return Response.json(
      ApiResponse.success(userDoc, "Usuario registrado correctamente"),
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      ApiResponse.failure("Error interno del servidor", ["Error inesperado"]),
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token)
      return Response.json(ApiResponse.failure("No autorizado"), {
        status: 401,
      });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const esColab = decoded.tipo === "colaborador"; // Verificamos el Claim

    const body = await req.json();
    const errors = getZodErrors(UpdateUserInfoSchema, body);

    if (!!errors) {
      return Response.json(ApiResponse.failure("Validación fallida", errors), {
        status: 400,
      });
    }

    const { nombre, apellido, foto, descripcion } = body;

    const updateData = {
      nombre: nombre.trim(),
      apellido: apellido?.trim() || "",
      foto: foto || null,
      descripcion: descripcion?.trim() || null,
    };

    // --- SINCRONIZACIÓN CON BATCH ---
    const batch = adminDb.batch();

    // Ref en Usuarios
    const userRef = adminDb.collection("usuarios").doc(uid);
    batch.update(userRef, updateData);

    // Si es colaborador, actualizamos su "perfil público"
    if (esColab) {
      const colabRef = adminDb.collection("colaboradores").doc(uid);

      // Usamos set con merge: true por si el doc de colaborador aún no existe
      batch.set(
        colabRef,
        {
          nombre: updateData.nombre,
          apellido: updateData.apellido,
          foto: updateData.foto,
          descripcion: updateData.descripcion,
        },
        { merge: true },
      );
    }

    await batch.commit();

    const updatedUserDoc = await userRef.get();

    if (!updatedUserDoc.exists) {
      return Response.json(
        ApiResponse.failure("Usuario no encontrado después de actualizar"),
        { status: 404 },
      );
    }

    const updatedUserData = updatedUserDoc.data();

    // Construir el objeto AppUser con los datos actualizados
    const updatedUser: AppUser = {
      uid: uid,
      email: updatedUserData?.email || decoded.email || "",
      nombre: updatedUserData?.nombre || "",
      apellido: updatedUserData?.apellido || "",
      foto: updatedUserData?.foto || null,
      tipo: decoded.tipo || "cliente",
      creado: new Date(updatedUserData?.creado || Date.now()).toISOString(),
      descripcion: updatedUserData?.descripcion || null,
    };

    // cookie
    await UserCookieService.setName(
      updatedUser.nombre + " " + updatedUser.apellido,
    );

    return new Response(
      ApiResponse.success(
        updatedUser,
        "Información sincronizada correctamente",
      ).toJSON(),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sincronizando:", error);
    return Response.json(ApiResponse.failure("Error de servidor"), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    // Tomamos el token del usuario desde la cookie
    const token = (await cookies()).get("token")?.value;

    if (!token)
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });

    // Verificamos el token con Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Obtenemos el documento de Firestore del usuario
    const userDoc = await adminDb.collection("usuarios").doc(uid).get();

    const user: UserDto = userDoc.data() as UserDto;

    if (!userDoc.exists) {
      return new Response(
        ApiResponse.failure("Usuario no encontrado").toJSON(),
        { status: 404 },
      );
    }

    // buscar en supabase
    if (user.foto === "bucket") {
      const { data: signedUrl } = await supabaseAdmin.storage
        .from("perfiles")
        .createSignedUrl(uid, 60);

      if (signedUrl) {
        user.foto = signedUrl.signedUrl;
      } else {
        user.foto =
          "https://pixabay.com/images/download/false-2061132_1920.png";
      }
    }

    // guardar en cookies
    await UserCookieService.setName(user.nombre + " " + user.apellido);

    return new Response(
      ApiResponse.success(user, "Usuario obtenido").toJSON(),
      { status: 200 },
    );
  } catch (error: any) {
    return new Response(
      ApiResponse.failure(error.message || "Error inesperado").toJSON(),
      { status: 500 },
    );
  }
}
