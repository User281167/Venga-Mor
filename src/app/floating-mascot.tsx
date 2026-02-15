"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Button,
  Flex,
  Popover,
  Text,
  Separator,
  Slider,
  IconButton,
} from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { themeColorNames, useTheme, availableExploreBgs } from "@/context/theme-context";
import { toast } from "sonner";
import { Play, Pause, Music } from "lucide-react";

const messages = [
  "Mor, modelos únicas.",
  "Mor, cada modelo pone sus restricciones.",
  "Mor, una app para calentarte.",
  "Mor, cada colaborador, un mundo distinto.",
  "Mor, no acoses, trata con respeto.",
  "Mor, trata a los demás como te gustaría que te traten.",
  "Mor, trata con amor a nuestras chicas.",
  "Mor, recuerda que esta app maneja seguridad de extremo a extremo.",
  "Mor, los acompañantes de servicio tienen su margen de precio individual.",
  "Mor, ofrecemos servicios como: charlas, citas, videollamadas, contenido y chats abiertos.",
  "Mor, recuerda que también hay servicios sin fin sexual.",
  "Mor, busca tu match.",
  "Mor, ábrete al amor.",
  "Mor, encuentra scorkl.",
  "Mor, miles de servicios en Venga Mor.",
  "Mor, vive cada segundo en Venga Mor.",
];

export function FloatingMascot() {
  const pathname = usePathname();
  const mascotImage = PlaceHolderImages.find((p) => p.id === "floating-mascot");

  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const {
    setExploreBackground,
    resetExploreBackground,
    setThemeColor,
    bgOpacity,
    setBgOpacity,
  } = useTheme();

  const noMascotRoutes = ["/iniciar-sesion", "/registrarse", "/restablecer-cuenta", "/"];
  const shouldShowMascot = !noMascotRoutes.includes(pathname);
  const isExplorePage = pathname.startsWith("/perfiles");

  const [selectedSong, setSelectedSong] = useState<File | null>(null);
  const [songUrl, setSongUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startLoop = () => {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 5500);
    };

    if (shouldShowMascot && !popoverOpen) {
      setIsVisible(true);
      startLoop();
    } else {
      setIsVisible(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shouldShowMascot, popoverOpen, messageIndex]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch((e) => console.error("Error playing audio:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, songUrl]);

  useEffect(() => {
    if (selectedSong) {
      const url = URL.createObjectURL(selectedSong);
      setSongUrl(url);

      return () => {
        URL.revokeObjectURL(url);
        setSongUrl(null);
      };
    }
  }, [selectedSong]);

  if (!mascotImage) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedSong(file);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (selectedSong) {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-24 left-4 z-[100] w-auto max-w-xs flex items-center gap-3 justify-start">
      <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Popover.Trigger>
          <div className="cursor-pointer">
            <Image
              src={mascotImage.imageUrl}
              alt={mascotImage.description}
              width={64}
              height={64}
              className="rounded-full object-cover shadow-lg border-2 border-primary"
            />
          </div>
        </Popover.Trigger>
        <Popover.Content>
          <Flex direction="column" gap="3" className="max-w-56 sm:max-w-96">
            <Text size="2" weight="bold">
              Estabilizador de Experiencia
            </Text>
            <Separator className="w-full" />
            <Text size="1" weight="bold" color="gray">
              Color del Tema
            </Text>
            <Flex gap="2" wrap="wrap" className="w-full">
              {themeColorNames.map((color) => (
                <Button key={color} size="1" variant="soft" onClick={() => setThemeColor(color)}>
                  {color}
                </Button>
              ))}
            </Flex>
            <Separator className="w-full" />
            <Text size="1" weight="bold" color="gray">
              Brillo del Fondo
            </Text>
            <Slider value={[bgOpacity]} onValueChange={(value) => setBgOpacity(value[0])} min={0} max={100} step={5} />
            <Separator className="w-full" />
            {isExplorePage && (
              <>
                <Text size="1" weight="bold" color="gray">
                  Fondo Explorar
                </Text>
                <Flex gap="2" wrap="wrap">
                  {availableExploreBgs.map((bg) => (
                    <Button
                      key={bg.id}
                      size="1"
                      variant="soft"
                      onClick={() => {
                        setExploreBackground(bg.imageUrl);
                        toast.success("Fondo actualizado");
                      }}
                    >
                      {bg.description}
                    </Button>
                  ))}
                  <Button size="1" variant="soft" color="gray" onClick={resetExploreBackground}>
                    Restablecer
                  </Button>
                </Flex>
                <Separator className="w-full" />
              </>
            )}
            <Text size="1" weight="bold" color="gray">
              Música Local
            </Text>
            <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            {songUrl && <audio ref={audioRef} src={songUrl} onEnded={() => setIsPlaying(false)} />}
            <Flex direction="column" align="center" gap="2">
              <Button variant="soft" onClick={() => fileInputRef.current?.click()} className="w-full">
                <Music size={14} /> Seleccionar canción
              </Button>
              {selectedSong && (
                <Flex align="center" justify="between" className="w-full" mt="2">
                  <Text size="1" truncate className="max-w-[150px]">
                    {selectedSong.name}
                  </Text>
                  <IconButton variant="ghost" onClick={togglePlayPause} disabled={!selectedSong}>
                    {isPlaying ? <Pause /> : <Play />}
                  </IconButton>
                </Flex>
              )}
            </Flex>
            <Separator className="w-full" />
            <Text size="1" color="gray">
              Modo Inmersivo (OLED) está activo.
            </Text>
          </Flex>
        </Popover.Content>
      </Popover.Root>

      <AnimatePresence onExitComplete={() => setMessageIndex((prev) => (prev + 1) % messages.length)}>
        {isVisible && !popoverOpen && (
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.4 } }}
            transition={{ duration: 0.5 }}
            className="bg-black/60 p-3 rounded-xl backdrop-blur-sm"
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
          >
            <Text as="p" size="2" weight="bold" className="text-white italic">
              "{messages[messageIndex]}"
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
