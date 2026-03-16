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
  Box,
} from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { themeColorNames, useTheme, availableExploreBgs } from "@/context/theme-context";
import { Play, Pause, Music, SkipBack, SkipForward, Radio } from "lucide-react";

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

const appPlaylist = [
  { name: "Venga Mix 1", url: "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/musica%2FWhatsApp%20Audio%202026-03-16%20at%202.43.18%20AM%20(1).mp3?alt=media&token=87d19f05-236e-40ef-b37e-cfe0314242c8" },
  { name: "Venga Mix 2", url: "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/musica%2FWhatsApp%20Audio%202026-03-16%20at%202.43.18%20AM.mp3?alt=media&token=1e1c0439-4da8-4f8e-a6c4-2ded1cfa0c4c" },
  { name: "Venga Mix 3", url: "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/musica%2FWhatsApp%20Audio%202026-03-16%20at%202.43.19%20AM.mp3?alt=media&token=f0b2d2a3-79cd-41eb-b119-8135d82cc432" },
  { name: "Venga Mix 4", url: "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/musica%2FWhatsApp%20Audio%202026-03-16%20at%202.43.26%20AM.mp3?alt=media&token=6c8b0865-75cf-4f03-955d-eee56d6f9389" },
  { name: "Venga Mix 5", url: "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/musica%2FWhatsApp%20Audio%202026-03-16%20at%202.43.30%20AM%20(1).mp3?alt=media&token=7e467858-f12a-4c07-afd8-cc6e33d49787" },
  { name: "Venga Mix 6", url: "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/musica%2FWhatsApp%20Audio%202026-03-16%20at%202.43.30%20AM%20(2).mp3?alt=media&token=84ce5c93-af03-4f2e-b910-c45d36a22a7a" },
  { name: "Venga Mix 7", url: "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/musica%2FWhatsApp%20Audio%202026-03-16%20at%202.43.30%20AM%20(3).mp3?alt=media&token=8a05a12f-589f-4efa-989b-ba197871fea2" },
  { name: "Venga Mix 8", url: "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/musica%2FWhatsApp%20Audio%202026-03-16%20at%202.43.30%20AM.mp3?alt=media&token=1c24212e-8a6f-4d0c-bf49-df9e80424573" },
  { name: "Venga Mix 9", url: "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/musica%2FWhatsApp%20Audio%202026-03-16%20at%202.43.31%20AM%20(1).mp3?alt=media&token=659b5ca5-2151-4a66-ab3d-328cc76eae00" },
  { name: "Venga Mix 10", url: "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/musica%2FWhatsApp%20Audio%202026-03-16%20at%202.43.31%20AM.mp3?alt=media&token=924a3d27-02aa-4811-a177-230595bf3fe0" },
];

export function FloatingMascot() {
  const pathname = usePathname();
  const mascotImage = PlaceHolderImages.find((p) => p.id === "floating-mascot");

  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const {
    setExploreBackground,
    setThemeColor,
    bgOpacity,
    setBgOpacity,
  } = useTheme();

  const noMascotRoutes = ["/iniciar-sesion", "/registrarse", "/restablecer-cuenta", "/"];
  const shouldShowMascot = !noMascotRoutes.includes(pathname);
  const isExplorePage = pathname.startsWith("/perfiles");

  const [selectedSong, setSelectedSong] = useState<File | null>(null);
  const [songUrl, setSongUrl] = useState<string | null>(null);
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentAppSongIndex, setCurrentAppSongIndex] = useState(0);
  const [isAppMusicPlaying, setIsAppMusicPlaying] = useState(false);
  const appAudioRef = useRef<HTMLAudioElement>(null);

  const isMusicPlaying = isAppMusicPlaying || isLocalPlaying;

  useEffect(() => {
    let messageLoop: NodeJS.Timeout;
    let visibilityToggle: NodeJS.Timeout;

    const startLoop = () => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
      setIsVisible(true);
      visibilityToggle = setTimeout(() => {
        setIsVisible(false);
      }, 5500);
      messageLoop = setTimeout(startLoop, 10000);
    };

    if (shouldShowMascot && !popoverOpen) {
      const initialTimeout = setTimeout(startLoop, 2000);
      return () => {
        clearTimeout(initialTimeout);
        clearTimeout(visibilityToggle);
        clearTimeout(messageLoop);
      };
    } else {
      setIsVisible(false);
    }
  }, [shouldShowMascot, popoverOpen]);

  useEffect(() => {
    if (isLocalPlaying) {
      localAudioRef.current?.play().catch(() => {});
      setIsAppMusicPlaying(false);
    } else {
      localAudioRef.current?.pause();
    }
  }, [isLocalPlaying, songUrl]);

  useEffect(() => {
    if (isAppMusicPlaying) {
      appAudioRef.current?.play().catch(() => {});
      setIsLocalPlaying(false);
    } else {
      appAudioRef.current?.pause();
    }
  }, [isAppMusicPlaying, currentAppSongIndex]);

  useEffect(() => {
    if (selectedSong) {
      const url = URL.createObjectURL(selectedSong);
      setSongUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedSong]);

  if (!mascotImage) return null;

  const handleLocalFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedSong(file);
      setIsLocalPlaying(true);
    }
  };

  const nextAppSong = () => {
    setCurrentAppSongIndex((prev) => (prev + 1) % appPlaylist.length);
    setIsAppMusicPlaying(true);
  };

  const prevAppSong = () => {
    setCurrentAppSongIndex((prev) => (prev - 1 + appPlaylist.length) % appPlaylist.length);
    setIsAppMusicPlaying(true);
  };

  return (
    <div className="fixed top-24 left-4 z-[100] w-auto max-w-xs flex items-center gap-3 justify-start">
      <audio ref={appAudioRef} src={appPlaylist[currentAppSongIndex].url} onEnded={nextAppSong} />
      {songUrl && <audio ref={localAudioRef} src={songUrl} onEnded={() => setIsLocalPlaying(false)} />}

      <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Popover.Trigger>
          <div className="cursor-pointer relative group">
            {isMusicPlaying && (
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping z-0" />
            )}
            <div className={`rounded-full transition-all duration-500 overflow-hidden ${isMusicPlaying ? 'p-0.5 bg-primary shadow-[0_0_15px_rgba(255,0,85,0.5)]' : 'p-0 bg-transparent'}`}>
              <Image
                src={mascotImage.imageUrl}
                alt={mascotImage.description}
                width={64}
                height={64}
                className={`rounded-full object-cover relative z-10 transition-transform ${popoverOpen ? 'scale-110' : ''}`}
              />
            </div>
          </div>
        </Popover.Trigger>
        <Popover.Content side="right" align="start" className="shadow-2xl border border-white/10 backdrop-blur-xl bg-black/80 p-4 rounded-3xl">
          <Flex direction="column" gap="3" className="w-64 sm:w-80">
            <Flex justify="between" align="center">
              <Text size="2" weight="bold" className="text-primary tracking-tight">
                Estabilizador Mor
              </Text>
              <Radio size={16} className={isMusicPlaying ? "text-green-500 animate-pulse" : "text-gray-500"} />
            </Flex>
            
            <Separator className="w-full opacity-20" />
            
            <Box className="bg-white/5 p-3 rounded-2xl border border-white/5">
              <Text size="1" weight="bold" color="gray" mb="2" as="div" className="uppercase tracking-widest text-[10px]">
                Playlist Oficial Mor
              </Text>
              <Flex direction="column" gap="2">
                <Text size="1" truncate className="text-white/90 font-medium">
                  {appPlaylist[currentAppSongIndex].name}
                </Text>
                <Flex align="center" justify="center" gap="4">
                  <IconButton variant="ghost" size="1" onClick={prevAppSong} className="text-white hover:text-primary cursor-pointer">
                    <SkipBack size={18} fill="currentColor" />
                  </IconButton>
                  <IconButton 
                    variant="soft" 
                    radius="full"
                    size="3" 
                    onClick={() => setIsAppMusicPlaying(!isAppMusicPlaying)}
                    className="bg-primary text-white hover:scale-105 transition-transform cursor-pointer"
                  >
                    {isAppMusicPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                  </IconButton>
                  <IconButton variant="ghost" size="1" onClick={nextAppSong} className="text-white hover:text-primary cursor-pointer">
                    <SkipForward size={18} fill="currentColor" />
                  </IconButton>
                </Flex>
              </Flex>
            </Box>

            <Separator className="w-full opacity-20" />

            <Text size="1" weight="bold" color="gray" className="uppercase tracking-widest text-[10px]">
              Estilo Visual
            </Text>
            
            <Flex gap="2" wrap="wrap">
              {themeColorNames.map((color) => (
                <Button key={color} size="1" variant="soft" onClick={() => setThemeColor(color)} className="cursor-pointer">
                  {color}
                </Button>
              ))}
            </Flex>

            <Flex direction="column" gap="2">
              <Text size="1" className="text-gray-400">Brillo Inmersivo</Text>
              <Slider value={[bgOpacity]} onValueChange={(v) => setBgOpacity(v[0])} min={0} max={100} step={5} className="cursor-pointer" />
            </Flex>

            {isExplorePage && (
              <Flex direction="column" gap="2">
                <Text size="1" className="text-gray-400">Fondo Ambiente</Text>
                <Flex gap="2" wrap="wrap">
                  {availableExploreBgs.map((bg) => (
                    <Button key={bg.id} size="1" variant="soft" onClick={() => setExploreBackground(bg.imageUrl)}>
                      {bg.description}
                    </Button>
                  ))}
                </Flex>
              </Flex>
            )}

            <Separator className="w-full opacity-20" />

            <Box>
              <Text size="1" weight="bold" color="gray" mb="2" as="div" className="uppercase tracking-widest text-[10px]">
                Mi Música Local
              </Text>
              <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleLocalFileChange} className="hidden" />
              <Flex direction="column" gap="2">
                <Button variant="outline" size="1" onClick={() => fileInputRef.current?.click()} className="w-full border-white/10 hover:bg-white/5 rounded-xl cursor-pointer">
                  <Music size={14} className="mr-2" /> Subir MP3
                </Button>
                {selectedSong && (
                  <Flex align="center" justify="between" className="bg-white/5 p-2 rounded-xl">
                    <Text size="1" truncate className="max-w-[120px] text-gray-400">
                      {selectedSong.name}
                    </Text>
                    <IconButton variant="ghost" size="1" onClick={() => setIsLocalPlaying(!isLocalPlaying)} className="text-primary cursor-pointer">
                      {isLocalPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </IconButton>
                  </Flex>
                )}
              </Flex>
            </Box>

            <Separator className="w-full opacity-20" />
            <Text size="1" color="gray" align="center" className="italic opacity-50">
              Modo Inmersivo (OLED) activo.
            </Text>
          </Flex>
        </Popover.Content>
      </Popover.Root>

      <AnimatePresence mode="wait">
        {isVisible && !popoverOpen && (
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="bg-black/70 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl"
          >
            <Text as="p" size="2" weight="bold" className="text-white italic leading-tight">
              "{messages[messageIndex]}"
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
