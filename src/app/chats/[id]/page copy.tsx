"use client";

import { useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import chatFlow from "@/lib/chat-flow.json";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Heading,
  Section,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Send } from "lucide-react";
import { escorts } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import SectionImg from "@/components/section-img";

type ChatNode = {
  texto: string;
  tipo?: "pregunta_abierta";
  opciones?: { label: string; next: string }[];
  siguiente_automatico?: string;
};

export default function ChatPage({ params }: { params: { id: string } }) {
  const escort = escorts.find((e) => e.id === params.id);
  const [currentNodeKey, setCurrentNodeKey] = useState("inicio");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(true); // Start disabled
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialNode = (chatFlow.nodos as Record<string, ChatNode>).inicio;
    setMessages([{ sender: "bot", text: initialNode.texto }]);
    if (initialNode.tipo === "pregunta_abierta") {
      setInputDisabled(false);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionClick = (option: { label: string; next: string }) => {
    setMessages((prev) => [...prev, { sender: "user", text: option.label }]);
    setInputDisabled(true);

    setTimeout(() => processNextNode(option.next), 500);
  };

  const handleSend = () => {
    if (userInput.trim() === "" || inputDisabled) return;

    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

    const currentNode = (chatFlow.nodos as Record<string, ChatNode>)[
      currentNodeKey
    ];
    if (currentNode.siguiente_automatico) {
      setInputDisabled(true);
      setTimeout(
        () => processNextNode(currentNode.siguiente_automatico!, userInput),
        500,
      );
    }

    setUserInput("");
  };

  const processNextNode = (nextNodeKey: string, previousInput?: string) => {
    const nextNode: ChatNode = (chatFlow.nodos as Record<string, ChatNode>)[
      nextNodeKey
    ];

    if (!nextNode) return;

    let botResponse = nextNode.texto;
    if (previousInput && nextNodeKey === "bienvenida_personalizada") {
      botResponse = `Encantada, ${previousInput}. Me tomo mi tiempo y seguridad muy en serio, por eso prefiero charlar un poco antes de pasar a lo formal. ¿Buscas algo para ahora mismo o estás planeando con antelación?`;
    }

    const newBotMessage: Message = { sender: "bot", text: botResponse };
    if (nextNode.opciones && nextNode.opciones.length > 0) {
      newBotMessage.options = nextNode.opciones;
      setInputDisabled(true);
    } else {
      setInputDisabled(nextNode.tipo !== "pregunta_abierta");
    }

    setMessages((prev) => [...prev, newBotMessage]);
    setCurrentNodeKey(nextNodeKey);
  };

  if (!escort) {
    notFound();
  }

  const profileImage = PlaceHolderImages.find((p) => p.id === escort.imageId);
  const bgImage = PlaceHolderImages.find((p) => p.id === "chat-bg");

  return (
    <SectionImg
      imageUrl={bgImage?.imageUrl}
      alt={bgImage?.description}
      imageHint={bgImage?.imageHint}
    >
      <Card className="max-w-2xl w-full mx-auto bg-card/80 flex-grow flex flex-col">
        <Flex p="4" align="center" gap="4" className="border-b border-border">
          <Avatar
            src={profileImage?.imageUrl}
            fallback={escort.name.charAt(0)}
            size="3"
            radius="full"
          />
          <Heading as="h1" className="text-2xl">
            {escort.name}
          </Heading>
        </Flex>

        <Flex
          direction="column"
          gap="3"
          className="p-4 flex-grow overflow-y-auto"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
              >
                <Text>{msg.text}</Text>
              </div>
              {msg.sender === "bot" && msg.options && (
                <Flex
                  direction="column"
                  gap="2"
                  mt="2"
                  className="max-w-[80%] w-full"
                >
                  {msg.options.map((opt) => (
                    <Button
                      key={opt.next}
                      variant="outline"
                      onClick={() => handleOptionClick(opt)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </Flex>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </Flex>

        <Flex p="4" gap="3" align="center" className="border-t border-border">
          <TextField.Root
            className="flex-grow"
            placeholder={
              inputDisabled
                ? "Selecciona una opción..."
                : "Escribe un mensaje..."
            }
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={inputDisabled}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          ></TextField.Root>
          <Button onClick={handleSend} disabled={inputDisabled}>
            <Send className="h-4 w-4" />
          </Button>
        </Flex>
      </Card>
    </SectionImg>
  );
}
