import { useUser } from "@/context/user-context";
import { useCallback, useEffect, useState } from "react";

import { ChatService } from "@/services/chat";
import { Message } from "./message";
import { PresenceService } from "@/services/presence";
import { ChatInfo } from "@/types/chat.type";

export const useChat = (chatId: string | undefined) => {
  const { user } = useUser();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [chatNotFound, setChatNotFound] = useState(false);
  const [chatError, setChatError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otherUserStatus, setOtherUserStatus] = useState<"online" | "offline">(
    "offline",
  );

  // limpiar error despues de 3 segundos
  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  useEffect(() => {
    if (!user?.uid || !chatId) return;

    let unsubscribeMessages: (() => void) | undefined;
    let unsubscribePresence: (() => void) | undefined;

    const loadChat = async () => {
      try {
        const info = await ChatService.getChatInfo(chatId, user.uid);

        if (!info) {
          setChatNotFound(true);
          return;
        }

        setChatInfo(info);

        unsubscribeMessages = ChatService.subscribeToMessages(
          chatId,
          setMessages,
        );

        ChatService.markMessagesAsRead(chatId, user.uid);

        const otherUserId = Object.keys(info.participants).find(
          (id) => id !== user.uid,
        );

        if (otherUserId) {
          unsubscribePresence = PresenceService.subscribeToUserStatus(
            otherUserId,
            setOtherUserStatus,
          );
        }

        setLoading(false);
      } catch (error) {
        setChatError(true);
        setErrorMessage("Failed to load chat");
      }
    };

    loadChat();

    return () => {
      unsubscribeMessages?.();
      unsubscribePresence?.();
    };
  }, [user?.uid, chatId, setErrorMessage]);

  const handleSend = useCallback(async () => {
    if (!message.trim() || !user || !chatId || !chatInfo) return;

    const otherUserId = Object.keys(chatInfo.participants).find(
      (id) => id !== user.uid,
    );

    if (!otherUserId) return;

    try {
      await ChatService.sendMessage(
        chatId,
        user.uid,
        `${user.nombre} ${user.apellido}`,
        otherUserId,
        message,
      );

      setMessage("");
    } catch (error) {
      setErrorMessage("Failed to send message");
    }
  }, [message, user, chatId, chatInfo, setErrorMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return {
    message,
    setMessage,
    messages,
    loading,
    chatInfo,
    otherUserStatus,
    chatNotFound,
    chatError,
    handleSend,
    handleKeyPress,
    errorMessage,
  };
};
