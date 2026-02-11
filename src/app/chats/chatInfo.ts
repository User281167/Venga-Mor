export interface ChatInfo {
  chatId: string;
  otherUser: {
    displayName: string;
    photoURL: string;
  } | null;
  lastMessage: {
    text: string;
    senderId: string;
    senderName: string;
    timestamp: number;
  } | null;
}
