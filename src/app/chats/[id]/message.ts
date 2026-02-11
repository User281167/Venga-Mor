export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  status: "sent" | "read";
}
