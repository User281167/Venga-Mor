import { realtimeDb } from "@/lib/firebase";
import {
  ref,
  push,
  onValue,
  query,
  limitToLast,
  set,
  update,
  get,
  serverTimestamp,
} from "firebase/database";

interface UserInfo {
  displayName: string;
  photoURL: string | null;
}

export class ChatService {
  // CHAT ID DETERMINÍSTICO (1-a-1)
  static getChatId(userA: string, userB: string) {
    return [userA, userB].sort().join("_");
  }

  // CREAR CHAT CON NOMBRES Y AVATARES
  static async createNewChat(
    user1Id: string,
    user1Info: UserInfo,
    user2Id: string,
    user2Info: UserInfo,
  ) {
    const chatId = this.getChatId(user1Id, user2Id);
    const chatRef = ref(realtimeDb, `chats/${chatId}`);

    // Verificar si ya existe
    const snapshot = await get(chatRef);
    if (snapshot.exists()) {
      return chatId;
    }

    // Crear chat con información desnormalizada
    await set(chatRef, {
      participants: {
        [user1Id]: {
          displayName: user1Info.displayName,
          photoURL: user1Info.photoURL,
        },
        [user2Id]: {
          displayName: user2Info.displayName,
          photoURL: user2Info.photoURL,
        },
      },
      createdAt: serverTimestamp(),
      lastMessage: null,
    });

    // Añadir referencias en ambos usuarios
    await set(ref(realtimeDb, `users/${user1Id}/chats/${chatId}`), true);
    await set(ref(realtimeDb, `users/${user2Id}/chats/${chatId}`), true);

    return chatId;
  }

  // ENVIAR MENSAJE (asegurando que el chat existe)
  static async sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    receiverId: string,
    message: string,
  ) {
    const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);

    // Guardar mensaje
    await push(messagesRef, {
      text: message,
      senderId,
      timestamp: serverTimestamp(),
      status: "sent",
    });

    // Actualizar último mensaje
    await set(ref(realtimeDb, `chats/${chatId}/lastMessage`), {
      text: message,
      senderId,
      senderName, // ✅ Guardamos el nombre
      timestamp: serverTimestamp(),
    });
  }

  // OBTENER O CREAR CHAT (helper importante)
  static async getOrCreateChat(
    user1Id: string,
    user1Info: UserInfo,
    user2Id: string,
    user2Info: UserInfo,
  ) {
    const chatId = this.getChatId(user1Id, user2Id);
    const chatRef = ref(realtimeDb, `chats/${chatId}`);

    const snapshot = await get(chatRef);

    if (!snapshot.exists()) {
      await this.createNewChat(user1Id, user1Info, user2Id, user2Info);
    }

    return chatId;
  }

  // ESCUCHAR MENSAJES
  static subscribeToMessages(
    chatId: string,
    callback: (messages: any[]) => void,
  ) {
    const messagesQuery = query(
      ref(realtimeDb, `chats/${chatId}/messages`),
      limitToLast(50),
    );

    return onValue(messagesQuery, (snapshot) => {
      const messages: any[] = [];
      snapshot.forEach((child) => {
        messages.push({
          id: child.key,
          ...child.val(),
        });
      });
      callback(messages);
    });
  }

  // MARCAR COMO LEÍDO
  static async markMessagesAsRead(chatId: string, userId: string) {
    const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);

    const snapshot = await get(messagesRef);
    const updates: any = {};

    snapshot.forEach((child) => {
      const msg = child.val();
      if (msg.senderId !== userId && msg.status !== "read") {
        updates[`${child.key}/status`] = "read";
      }
    });

    if (Object.keys(updates).length > 0) {
      await update(messagesRef, updates);
    }
  }

  // OBTENER CHATS DEL USUARIO CON INFO
  static getUserChats(userId: string, callback: (chats: any[]) => void) {
    const chatsRef = ref(realtimeDb, `users/${userId}/chats`);

    return onValue(chatsRef, async (snapshot) => {
      const chatPromises: Promise<any>[] = [];

      snapshot.forEach((childSnapshot) => {
        const chatId = childSnapshot.key!;
        chatPromises.push(this.getChatInfo(chatId, userId));
      });

      const chats = await Promise.all(chatPromises);
      callback(chats.filter(Boolean));
    });
  }

  static async getChatInfo(chatId: string, currentUserId: string) {
    const chatRef = ref(realtimeDb, `chats/${chatId}`);
    const snapshot = await get(chatRef);

    if (!snapshot.exists()) return null;

    const chatData = snapshot.val();

    // Encontrar el otro participante
    const otherUserId = Object.keys(chatData.participants).find(
      (id) => id !== currentUserId,
    );

    return {
      chatId,
      participants: chatData.participants,
      otherUser: otherUserId ? chatData.participants[otherUserId] : null,
      lastMessage: chatData.lastMessage,
    };
  }
}
