"use client";
import Link from "next/link";
import { Button, Flex, Heading, Section, Dialog, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const introGifs = [
    "https://i.ibb.co/4wx2qPMz/In-Shot-20260219-212506821.gif",
    "https://i.ibb.co/2Y6y6v94/69b7864d645a301516c9025e.gif"
  ];

  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosTip, setShowIosTip] = useState(false);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    // Registro del Service Worker para PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registrado"))
        .catch((err) => console.log("Error registrando SW:", err));
    }

    // Atrapamos el evento de instalación
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
      console.log('Evento beforeinstallprompt capturado');
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
      console.log('App instalada con éxito');
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    // Rotación de GIFs cada 5 segundos
    const interval = setInterval(() => {
      setCurrentGifIndex((prev) => (prev + 1) % introGifs.length);
    }, 5000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearInterval(interval);
    };
  }, [introGifs.length]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`El usuario eligió: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    } else {
      const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);
      if (isIos) {
        setShowIosTip(true);
      } else {
        alert(
          'Busca la opción "Instalar" o "Añadir a pantalla de inicio" en el menú de tu navegador.'
        );
      }
    }
  };

  return (
    <Section className="relative h-screen w-full flex flex-col items-center justify-end p-0 overflow-hidden bg-black">
      {/* Background GIFs Rotativos con ajuste para NO CORTARSE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGifIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 flex items-start justify-center"
        >
          <Image
            src={introGifs[currentGifIndex]}
            alt="Intro Venga Mor"
            fill
            className="z-0 object-contain object-top" // Ajustado para que se vea completo arriba
            unoptimized
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay inferior */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

      {/* Contenedor de contenido ajustado para móviles - más pequeño */}
      <div className="relative z-20 w-full max-w-[280px] mx-auto p-4 flex flex-col items-center text-center pb-10">
        <Heading
          className="text-4xl md:text-7xl font-headline text-primary mb-4"
          style={{
            fontFamily: "'Playball', cursive",
            textShadow: "0px 0px 15px rgba(255,0,85,0.6)",
          }}
        >
          Venga Mor
        </Heading>

        <Flex direction="column" gap="2" className="w-full">
          <Link href="/iniciar-sesion" className="w-full">
            <Button
              size="3"
              className="w-full cursor-pointer bg-primary text-primary-foreground h-10 text-sm font-bold rounded-xl"
            >
              INGRESAR
            </Button>
          </Link>

          <Link href="/perfiles" className="w-full">
            <Button
              size="3"
              variant="ghost"
              className="w-full cursor-pointer h-10 text-sm font-bold text-white hover:bg-white/10"
            >
              VER PERFILES
            </Button>
          </Link>

          <Button
            size="3"
            variant="outline"
            className="w-full cursor-pointer h-10 text-sm font-bold bg-black/40 border-white/20 text-white rounded-xl mt-1"
            onClick={handleInstallClick}
          >
            <Download className="mr-2 h-4 w-4" />
            DESCARGAR APP
          </Button>

          {/* Modal de ayuda para instalación en iPhone */}
          <Dialog.Root open={showIosTip} onOpenChange={setShowIosTip}>
            <Dialog.Content style={{ maxWidth: 350 }} className="rounded-3xl bg-zinc-900 border border-white/10">
              <Dialog.Title className="text-white">Instalar en iPhone</Dialog.Title>
              <Dialog.Description size="2" mb="4" className="text-gray-300">
                Sigue estos pasos para tener la App en tu menú:
                <br /><br />
                1. Toca el botón <b>Compartir</b> <img src="https://img.icons8.com/ios/18/ffffff/upload.png" alt="compartir" className="inline align-middle mx-1" /> abajo.
                <br />
                2. Elige <b>"Añadir a pantalla de inicio"</b>.
              </Dialog.Description>
              <Flex justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="pink" className="cursor-pointer">Entendido</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </div>
    </Section>
  );
}
