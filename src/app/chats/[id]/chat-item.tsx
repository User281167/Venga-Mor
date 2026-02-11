"use client";

import { Text } from "@radix-ui/themes";
import React from "react";

import { Message } from "./message";

export const ChatItem = React.memo(
  ({ msg, isMyMessage }: { msg: Message; isMyMessage: boolean }) => {
    return (
      <div
        className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}
      >
        <div
          className={`p-3 rounded-lg max-w-[80%] ${
            isMyMessage ? "bg-primary text-primary-foreground" : "bg-secondary"
          }`}
        >
          <Text>{msg.text}</Text>
        </div>

        <Text size="1" className="text-muted-foreground mt-1">
          {new Date(msg.timestamp).toLocaleDateString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}

          {isMyMessage && msg.status === "read" && " · Leído"}
        </Text>
      </div>
    );
  },
);
