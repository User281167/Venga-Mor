import { realtimeDb } from "@/lib/firebase";

import {
  Chat,
  ChatInfo,
  LastMessageDB,
  Message,
  MessageDB,
  MessageType,
} from "@/types/chat.type";

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
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  orderByKey,
  endBefore,
} from "firebase/database";
import { StorageService, UploadResult } from "./storage";
import { BusinessError } from "@/errors/errors";
import { api } from "@/lib/apiHelper";

interface UserInfo {
  displayName: string;
  photoURL: string | null;
}

export class ChatService {
  // CHAT ID DETERMINÍSTICO (1-a-1)
  static getChatId(userA: string, userB: string): string {
    return [userA, userB].sort().join("_");
  }

  // CREAR CHAT CON NOMBRES Y AVATARES
  static async createNewChat(
    user1Id: string,
    user1Info: UserInfo,
    user2Id: string,
    user2Info: UserInfo,
  ): Promise<string> {
    const res = await api.post<string>(
      `/api/chat/create/?receiverId=${user2Id}`,
    );

    if (!res.success || !res.data) {
      throw new BusinessError("Error creando el chat");
    }

    return res.data;
  }

  // ENVIAR MENSAJE (asegurando que el chat existe)
  static async sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    receiverId: string,
    message: string,
    replyTo?: Message, // Mensaje al que responde
  ) {
    const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);

    const newMessage: MessageDB = {
      type: "text",
      text: message,
      senderId,
      timestamp: serverTimestamp(),
      status: "sent",
      replyTo: null,
      mediaMetadata: null,
      mediaUrl: null,
    };

    // Si hay reply, agregar la info desnormalizada
    if (replyTo) {
      newMessage.replyTo = {
        messageId: replyTo.id,
        text: replyTo.text.substring(0, 100),
        senderId: replyTo.senderId,
        type: replyTo.type,
        mediaUrl: replyTo.mediaUrl,
        thumbnailUrl: replyTo.mediaMetadata?.thumbnailUrl ?? null,
      };
    }

    await push(messagesRef, newMessage);

    // Actualizar último mensaje
    const lastMessage: LastMessageDB = {
      text: message,
      senderId,
      senderName,
      timestamp: serverTimestamp(),
    };

    await set(ref(realtimeDb, `chats/${chatId}/lastMessage`), lastMessage);
  }

  // ENVIAR MENSAJE MULTIMEDIA GENÉRICO
  static async sendMediaMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    file: File,
    messageType: MessageType,
    caption?: string,
    replyTo?: Message,
  ) {
    const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
    const tempMessageRef = push(messagesRef);
    const messageId = tempMessageRef.key!;

    try {
      let uploadResult: UploadResult;

      // Subir según el tipo
      switch (messageType) {
        case "image":
          uploadResult = await StorageService.uploadImage(
            chatId,
            messageId,
            file,
          );
          break;
        case "video":
          uploadResult = await StorageService.uploadVideo(
            chatId,
            messageId,
            file,
          );
          break;
        case "audio":
          uploadResult = await StorageService.uploadAudio(
            chatId,
            messageId,
            file,
          );
          break;
        case "file":
          uploadResult = await StorageService.uploadFile(
            chatId,
            messageId,
            file,
          );
          break;
        default:
          throw new BusinessError("Tipo de archivo no soportado");
      }

      // Crear mensaje
      const newMessage: MessageDB = {
        type: messageType,
        text: caption || "",
        senderId,
        timestamp: serverTimestamp(),
        status: "sent",
        mediaUrl: uploadResult.url,
        mediaMetadata: uploadResult.metadata ?? null,
        replyTo: null,
      };

      if (replyTo) {
        newMessage.replyTo = {
          messageId: replyTo.id,
          text: replyTo.text.substring(0, 100),
          senderId: replyTo.senderId,
          type: replyTo.type,
          mediaUrl: replyTo.mediaUrl,
          thumbnailUrl: replyTo.mediaMetadata?.thumbnailUrl ?? null,
        };
      }

      await set(tempMessageRef, newMessage);

      // Actualizar último mensaje
      const emojiMap = {
        image: "📷",
        video: "🎥",
        audio: "🎵",
        file: "📎",
      };

      const lastMessage: LastMessageDB = {
        text: caption || `${emojiMap[messageType]} ${messageType}`,
        senderId,
        senderName,
        timestamp: serverTimestamp(),
      };

      await set(ref(realtimeDb, `chats/${chatId}/lastMessage`), lastMessage);
    } catch (error) {
      await set(tempMessageRef, null);
      throw error;
    }
  }

  // OBTENER O CREAR CHAT (helper importante)
  static async getOrCreateChat(
    user1Id: string,
    user1Info: UserInfo,
    user2Id: string,
    user2Info: UserInfo,
  ): Promise<string> {
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
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    limit: number = 10,
  ) {
    // Firebase elimina automáticamente el más viejo del query (por el limitToLast(50)).
    // Eso dispara:
    // onChildRemoved
    // Si NO estás escuchando onChildRemoved…
    // Estado local tendrá 51 mensajes
    // Firebase solo tiene 50 en el query
    // Se desincroniza

    const messagesQuery = query(
      ref(realtimeDb, `chats/${chatId}/messages`),
      limitToLast(limit),
    );

    // Mensajes existentes + nuevos
    const unsubscribeAdded = onChildAdded(messagesQuery, (snapshot) => {
      const newMessage: Message = {
        id: snapshot.key!,
        ...snapshot.val(),
      };

      setMessages((prev) => {
        // evitar duplicados (importante en reconexiones)
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    // Mensaje editado (ej: status read)
    const unsubscribeChanged = onChildChanged(messagesQuery, (snapshot) => {
      const updatedMessage: Message = {
        id: snapshot.key!,
        ...snapshot.val(),
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m)),
      );
    });

    // Mensaje eliminado (cuando limitToLast saca el más viejo)
    const unsubscribeRemoved = onChildRemoved(messagesQuery, (snapshot) => {
      setMessages((prev) => prev.filter((m) => m.id !== snapshot.key));
    });

    // Cleanup
    return () => {
      unsubscribeAdded();
      unsubscribeChanged();
      unsubscribeRemoved();
    };
  }

  // CARGAR MENSAJES ANTERIORES (PAGINACIÓN)
  static async loadOlderMessages(
    chatId: string,
    oldestMessageId: string,
    limit: number = 10,
  ): Promise<Message[]> {
    const messagesQuery = query(
      ref(realtimeDb, `chats/${chatId}/messages`),
      orderByKey(),
      endBefore(oldestMessageId),
      limitToLast(limit),
    );

    const snapshot = await get(messagesQuery);
    const messages: Message[] = [];

    snapshot.forEach((child) => {
      messages.push({
        id: child.key!,
        ...child.val(),
      });
    });

    return messages;
  }

  // VERIFICAR SI HAY MÁS MENSAJES
  static async hasMoreMessages(
    chatId: string,
    oldestMessageId: string,
  ): Promise<boolean> {
    const messagesQuery = query(
      ref(realtimeDb, `chats/${chatId}/messages`),
      orderByKey(),
      endBefore(oldestMessageId),
      limitToLast(1),
    );

    const snapshot = await get(messagesQuery);
    return snapshot.exists();
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
  static getUserChats(userId: string, callback: (chats: ChatInfo[]) => void) {
    const chatsRef = ref(realtimeDb, `users/${userId}/chats`);

    return onValue(chatsRef, async (snapshot) => {
      const chatPromises: Promise<ChatInfo | null>[] = [];

      snapshot.forEach((childSnapshot) => {
        const chatId = childSnapshot.key!;
        chatPromises.push(this.getChatInfo(chatId, userId));
      });

      const chats = await Promise.all(chatPromises);
      callback(chats.filter((chat): chat is ChatInfo => chat !== null));
    });
  }

  static async getChatInfo(
    chatId: string,
    currentUserId: string,
  ): Promise<ChatInfo | null> {
    const chatRef = ref(realtimeDb, `chats/${chatId}`);
    const snapshot = await get(chatRef);

    if (!snapshot.exists()) return null;

    const chatData = snapshot.val() as Chat;

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
