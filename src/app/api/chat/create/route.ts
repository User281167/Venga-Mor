import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getUserID } from "../../utils";
import { ApiResponse } from "@/lib/api-response";
import { adminDb, adminRealtime } from "@/lib/firebase-admin-connection";

export async function POST(request: NextRequest) {
  try {
    const currentUserId = await getUserID();

    if (!currentUserId) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const receiverId = request.nextUrl.searchParams.get("receiverId");

    if (!receiverId) {
      return new Response(
        ApiResponse.failure("receiverId es requerido").toJSON(),
        { status: 400 },
      );
    }

    // No puedes crear chat contigo mismo
    if (currentUserId === receiverId) {
      return new Response(
        ApiResponse.failure("No puedes crear un chat contigo mismo").toJSON(),
        { status: 400 },
      );
    }

    // VALIDAR QUE EL RECEPTOR SEA COLABORADOR
    const receiverDoc = await adminDb
      .collection("colaboradores")
      .doc(receiverId)
      .get();

    if (!receiverDoc.exists) {
      return new Response(
        ApiResponse.failure("El receptor no es un colaborador válido").toJSON(),
        { status: 403 },
      );
    }

    const receiverData = receiverDoc.data()!;

    // OBTENER DATOS DEL USUARIO ACTUAL (puede ser usuario O colaborador)
    let currentUserData;
    let currentUserDisplayName: string;
    let currentUserPhotoURL: string | null = null;

    // Intentar en usuarios primero
    const userDoc = await adminDb
      .collection("usuarios")
      .doc(currentUserId)
      .get();

    if (userDoc.exists) {
      currentUserData = userDoc.data()!;
      currentUserDisplayName = `${currentUserData.nombre} ${currentUserData.apellido}`;
      currentUserPhotoURL = currentUserData.foto || null;
    } else {
      return new Response(
        ApiResponse.failure("Usuario no encontrado en el sistema").toJSON(),
        { status: 404 },
      );
    }

    // GENERAR CHATID DETERMINÍSTICO
    const chatId = [currentUserId, receiverId].sort().join("_");

    // VERIFICAR SI EL CHAT YA EXISTE
    // const realtimeDb = getDatabase();
    const chatRef = adminRealtime.ref(`chats/${chatId}`);
    const chatSnapshot = await chatRef.once("value");

    if (chatSnapshot.exists()) {
      return new Response(
        ApiResponse.success({ chatId, exists: true }).toJSON(),
        { status: 200 },
      );
    }

    // CREAR CHAT EN REALTIME DATABASE
    await chatRef.set({
      participants: {
        [currentUserId]: {
          displayName: currentUserDisplayName,
          photoURL: currentUserPhotoURL,
        },
        [receiverId]: {
          displayName: `${receiverData.nombre} ${receiverData.apellido}`,
          photoURL: receiverData.foto || null,
        },
      },
      createdAt: {
        ".sv": "timestamp",
      },
      lastMessage: null,
    });

    // Referencias de chat en ambos usuarios
    await adminRealtime
      ?.ref(`users/${currentUserId}/chats/${chatId}`)
      .set(true);
    await adminRealtime?.ref(`users/${receiverId}/chats/${chatId}`).set(true);

    // CREAR ÍNDICE EN FIRESTORE (solo para Storage Rules)
    const firestore = getFirestore();
    const batch = firestore.batch();

    const participant1Ref = firestore
      .collection("chat_participants")
      .doc(chatId)
      .collection("members")
      .doc(currentUserId);

    const participant2Ref = firestore
      .collection("chat_participants")
      .doc(chatId)
      .collection("members")
      .doc(receiverId);

    batch.set(participant1Ref, {
      displayName: currentUserDisplayName,
      joinedAt: new Date(),
    });

    batch.set(participant2Ref, {
      displayName: `${receiverData.nombre} ${receiverData.apellido}`,
      joinedAt: new Date(),
    });

    await batch.commit();

    // RETORNAR ÉXITO
    return new Response(
      ApiResponse.success({
        chatId,
        exists: false,
        message: "Chat creado exitosamente",
      }).toJSON(),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating chat:", error);
    return new Response(ApiResponse.failure("Error al crear chat").toJSON(), {
      status: 500,
    });
  }
}
