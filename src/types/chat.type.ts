import { serverTimestamp } from "firebase/database";

export type ServerTimestamp = ReturnType<typeof serverTimestamp>;

/* ============================
   BASE
============================ */

export type MessageStatus = "sent" | "read";

export interface ParticipantInfo {
  displayName: string;
  photoURL: string | null;
}

export type Participants = Record<string, ParticipantInfo>;

/* ============================
   WRITE MODELS (lo que envías)
============================ */

export interface MessageDB {
  text: string;
  senderId: string;
  timestamp: number | ServerTimestamp;
  status: MessageStatus;
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
