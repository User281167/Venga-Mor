import { useUser } from "@/context/user-context";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChatService } from "@/services/chat";
import { PresenceService } from "@/services/presence";
import { ChatInfo, Message } from "@/types/chat.type";

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
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Flag para controlar cuándo hacer scroll al final
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Referencia al número de mensajes anterior
  const prevMessagesLengthRef = useRef(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Limpiar error después de 3 segundos
  useEffect(() => {
    if (!errorMessage) return;

    const timeout = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  // Detectar si se agregó un mensaje nuevo (no carga antigua)
  useEffect(() => {
    const prevLength = prevMessagesLengthRef.current;
    const currentLength = messages.length;

    // Si aumentó en 1 y NO estamos cargando antiguos = mensaje nuevo
    if (currentLength > prevLength && !loadingOlder) {
      const isNewMessage = currentLength === prevLength + 1;

      if (isNewMessage) {
        // Verificar si el nuevo mensaje está al final (mensaje recién enviado/recibido)
        const container = messagesContainerRef.current;
        if (container) {
          const isNearBottom =
            container.scrollHeight -
              container.scrollTop -
              container.clientHeight <
            100;

          // Solo scroll si estábamos cerca del final
          setShouldScrollToBottom(isNearBottom);
        } else {
          // Si no hay referencia, asumir que queremos scroll (carga inicial)
          setShouldScrollToBottom(true);
        }
      }
    }

    prevMessagesLengthRef.current = currentLength;
  }, [messages, loadingOlder]);

  useEffect(() => {
    if (!user?.uid || !chatId) return;
    setMessages([]);
    setShouldScrollToBottom(true); // Reset al cambiar de chat

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
  }, [user?.uid, chatId]);

  const handleSend = useCallback(async () => {
    if (!message.trim() || !user || !chatId || !chatInfo) return;

    const otherUserId = Object.keys(chatInfo.participants).find(
      (id) => id !== user.uid,
    );

    if (!otherUserId) return;

    // Activar scroll al final antes de enviar
    setShouldScrollToBottom(true);

    try {
      await ChatService.sendMessage(
        chatId,
        user.uid,
        `${user.nombre} ${user.apellido}`,
        otherUserId,
        message,
        replyingTo || undefined,
      );

      setMessage("");
      setReplyingTo(null);
    } catch (error) {
      setErrorMessage("Failed to send message");
    }
  }, [message, user, chatId, chatInfo, replyingTo]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // Cargar mensajes antiguos
  const loadOlderMessages = useCallback(async () => {
    if (loadingOlder || !hasMore || messages.length === 0 || !chatId) return;

    // Desactivar scroll automático durante la carga
    setShouldScrollToBottom(false);
    setLoadingOlder(true);

    const oldestMessage = messages[0];
    const container = messagesContainerRef.current;
    const previousScrollHeight = container?.scrollHeight || 0;

    try {
      const olderMessages = await ChatService.loadOlderMessages(
        chatId,
        oldestMessage.id,
        10,
      );

      if (olderMessages.length === 0) {
        setHasMore(false);
        return;
      }

      // Verificar si hay más mensajes
      const stillHasMore = await ChatService.hasMoreMessages(
        chatId,
        olderMessages[0].id,
      );
      setHasMore(stillHasMore);

      // Agregar mensajes antiguos al inicio
      setMessages((prev) => [...olderMessages, ...prev]);

      // Mantener posición del scroll
      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          const scrollDiff = newScrollHeight - previousScrollHeight;
          container.scrollTop += scrollDiff;
        }
      }, 0);
    } catch (error) {
      console.error("Error loading older messages:", error);
    } finally {
      setLoadingOlder(false);
    }
  }, [loadingOlder, hasMore, messages, chatId]);

  // Intersection Observer para detectar scroll arriba
  useEffect(() => {
    if (!loadMoreTriggerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingOlder && hasMore) {
          loadOlderMessages();
        }
      },
      {
        root: messagesContainerRef.current,
        rootMargin: "100px",
        threshold: 0,
      },
    );

    observerRef.current.observe(loadMoreTriggerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadOlderMessages, loadingOlder, hasMore]);

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
    replyingTo,
    setReplyingTo,
    loadingOlder,
    hasMore,
    observerRef,
    loadMoreTriggerRef,
    messagesContainerRef,
    shouldScrollToBottom,
  };
};
