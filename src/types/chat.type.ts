import { serverTimestamp } from "firebase/database";

export type ServerTimestamp = ReturnType<typeof serverTimestamp>;
export type MessageStatus = "sent" | "read";
export type MessageType = "text" | "image" | "video" | "audio" | "file";

/* ============================
   BASE
============================ */

export interface ParticipantInfo {
  displayName: string;
  photoURL: string | null;
}

export type Participants = Record<string, ParticipantInfo>;

/* ============================ MEDIA METADATA ============================ */
export interface ChatMediaMetadata {
  size: number; // bytes
  mimeType: string;
  fileName: string | null;
  // Para imágenes y videos
  width: number | null;
  height: number | null;
  // Para audio y video
  duration: number | null; // segundos
  // Thumbnail para videos
  thumbnailUrl: string | null;
}

/* ============================ REPLY INFO ============================ */
export interface ReplyInfo {
  messageId: string; // ID del mensaje original (para scroll)
  text: string; // Preview del texto
  senderId: string; // ID del remitente original
  type: MessageType;
  mediaUrl: string | null; // Preview de media en reply
  thumbnailUrl: string | null; // Para videos
}

/* ============================
   WRITE MODELS (lo que envías)
============================ */

export interface MessageDB {
  type: MessageType;
  text: string;
  senderId: string;
  timestamp: number | ServerTimestamp;
  status: MessageStatus;
  replyTo: ReplyInfo | null;
  // Media fields (solo para type != "text")
  mediaUrl: string | null;
  mediaMetadata: ChatMediaMetadata | null;
}

export interface LastMessageDB {
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number | ServerTimestamp;
}

export interface ChatDB {
  createdAt: number | ServerTimestamp;
  participants: Participants;
  lastMessage: LastMessageDB | null;
}

/* ============================
   READ MODELS (lo que recibes)
============================ */

export interface Message extends Omit<MessageDB, "timestamp"> {
  id: string;
  timestamp: number;
}

export interface LastMessage extends Omit<LastMessageDB, "timestamp"> {
  timestamp: number;
}

export interface Chat {
  createdAt: number;
  participants: Participants;
  lastMessage: LastMessage | null;
}

export interface ChatInfo {
  chatId: string;
  participants: Participants;
  otherUser: ParticipantInfo | null;
  lastMessage: LastMessage | null;
}
