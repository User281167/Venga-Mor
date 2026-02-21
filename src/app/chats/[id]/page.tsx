"use client";

import { Card, Flex, Spinner, Text } from "@radix-ui/themes";
import SectionImg from "@/components/section-img";
import { PlaceHolderImages } from "@/lib/placeholder-images";

import { useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import { useUser } from "@/context/user-context";
import { useChat } from "./chat-message.hook";
import { toast } from "sonner";
import { Message } from "@/types/chat.type";

import { ChatHeader } from "./components/chat-header";
import { ChatMessageList } from "./components/chat-message-list";
import { ChatInput } from "./components/chat-input";

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const { user } = useUser();
  const {
    loading,
    chatInfo,
    otherUserStatus,
    messages,
    message,
    setMessage,
    chatNotFound,
    chatError,
    handleKeyPress,
    errorMessage,
    replyingTo,
    setReplyingTo,
    hasMore,
    loadingOlder,
    loadMoreTriggerRef,
    messagesContainerRef,
    shouldScrollToBottom,
    uploadingMedia,
    uploadProgress,
    file,
    setFile,
    handleSendMessageWithType,
  } = useChat(params.id);

  const bgImage = PlaceHolderImages.find((p) => p.id === "chat-bg");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldScrollToBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, shouldScrollToBottom]);

  const handleReply = useCallback(
    (msg: Message) => setReplyingTo(msg),
    [setReplyingTo],
  );

  const handleScrollToMessage = useCallback((messageId: string) => {
    const el = messageRefs.current.get(messageId);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("bg-accent/30");
    setTimeout(() => el.classList.remove("bg-accent/30"), 2000);
  }, []);

  if (errorMessage) toast.error(errorMessage);

  const bgProps = {
    imageUrl: bgImage?.imageUrl,
    alt: bgImage?.description,
    imageHint: bgImage?.imageHint,
  };

  if (loading) {
    return (
      <SectionImg {...bgProps}>
        <Spinner />
      </SectionImg>
    );
  }

  if (chatError) {
    return (
      <SectionImg {...bgProps}>
        <Text>Error al cargar el chat</Text>
      </SectionImg>
    );
  }

  if (chatNotFound || !chatInfo || !chatInfo.otherUser) {
    return (
      <SectionImg {...bgProps}>
        <Text>Chat no encontrado</Text>
      </SectionImg>
    );
  }

  return (
    <SectionImg {...bgProps}>
      <Card className="max-w-2xl w-full mx-auto bg-card/50 flex-grow flex flex-col max-h-[90vh]">
        <ChatHeader chatInfo={chatInfo} otherUserStatus={otherUserStatus} />

        <ChatMessageList
          messages={messages}
          currentUserId={user?.uid ?? ""}
          hasMore={hasMore}
          loadingOlder={loadingOlder}
          loadMoreTriggerRef={
            loadMoreTriggerRef as React.RefObject<HTMLDivElement>
          }
          messagesContainerRef={
            messagesContainerRef as React.RefObject<HTMLDivElement>
          }
          chatEndRef={chatEndRef as React.RefObject<HTMLDivElement>}
          messageRefs={messageRefs}
          onReply={handleReply}
          onScrollToMessage={handleScrollToMessage}
        />

        <ChatInput
          message={message}
          setMessage={setMessage}
          handleKeyPress={handleKeyPress}
          handleSendMessageWithType={handleSendMessageWithType}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          file={file}
          setFile={setFile}
          fileRef={fileRef as React.RefObject<HTMLInputElement>}
          uploadingMedia={uploadingMedia}
          uploadProgress={uploadProgress}
        />
      </Card>
    </SectionImg>
  );
}
