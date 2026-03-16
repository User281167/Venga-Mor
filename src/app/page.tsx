"use client";
import Link from "next/link";
import { Button, Flex, Heading, Section, Dialog, Text } from "@radix-ui/themes";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const introGifs = [
    PlaceHolderImages.find((p) => p.id === "intro-gif")?.imageUrl,
    PlaceHolderImages.find((p) => p.id === "intro-gif-alt")?.imageUrl,
  ].filter(Boolean);

  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosTip, setShowIosTip] = useState(false);

  useEffect(() => {
    // Registro del Service Worker para PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registrado"))
        .catch((err) => console.log("Error registrando SW:", err));
    }

    // Capturar el evento de instalación
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Rotación de GIFs cada 5 segundos
    const interval = setInterval(() => {
      setCurrentGifIndex((prev) => (prev + 1) % introGifs.length);
    }, 5000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, [introGifs.length]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Mostrar el diálogo nativo de instalación (Android/PC)
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('App instalada con éxito');
      }
      setDeferredPrompt(null);
    } else {
      // Detección de iOS para mostrar instrucciones manuales
      const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);
      if (isIos) {
        setShowIosTip(true);
      } else {
        alert(
          'Busca la opción "Instalar aplicación" o "Añadir a pantalla de inicio" en el menú de tu navegador.'
        );
      }
    }
  };

  return (
    <Section className="relative h-screen w-full flex flex-col items-center justify-end p-0 overflow-hidden bg-black">
      {/* Background GIFs Rotativos con ajuste de cobertura total */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGifIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {introGifs[currentGifIndex] && (
            <Image
              src={introGifs[currentGifIndex]!}
              alt="Intro Venga Mor"
              fill
              className="z-0 object-cover object-center"
              unoptimized
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay inferior */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

      {/* Contenedor de contenido ajustado para móviles */}
      <div className="relative z-20 w-full max-w-sm mx-auto p-6 flex flex-col items-center text-center pb-12">
        <Heading
          className="text-7xl md:text-9xl font-headline text-primary mb-6"
          style={{
            fontFamily: "'Playball', cursive",
            textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          Venga Mor
        </Heading>

        <Flex direction="column" gap="2" className="w-full">
          <Link href="/iniciar-sesion" className="w-full">
            <Button
              size="3"
              className="w-full cursor-pointer bg-primary text-primary-foreground h-10 md:h-12 text-md md:text-lg font-semibold rounded-xl"
            >
              Ingresar
            </Button>
          </Link>

          <Link href="/perfiles" className="w-full">
            <Button
              size="3"
              variant="ghost"
              className="w-full cursor-pointer h-10 md:h-12 text-md md:text-lg font-semibold text-white hover:bg-white/10"
            >
              Ver perfiles
            </Button>
          </Link>

          <Button
            size="3"
            variant="outline"
            className="w-full cursor-pointer h-10 md:h-12 text-md md:text-lg font-semibold bg-black/20 border-white/20 text-white rounded-xl mt-2"
            onClick={handleInstallClick}
          >
            <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Descargar App
          </Button>

          {/* Modal de ayuda para instalación en iPhone */}
          <Dialog.Root open={showIosTip} onOpenChange={setShowIosTip}>
            <Dialog.Content style={{ maxWidth: 400 }} className="rounded-3xl">
              <Dialog.Title>Instalar en tu iPhone</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                Sigue estos pasos para tener Venga Mor en tu menú:
                <br /><br />
                1. Toca el botón <b>Compartir</b> <img src="https://img.icons8.com/ios/18/ffffff/upload.png" alt="compartir" className="inline align-middle mx-1" /> abajo.
                <br />
                2. Desliza y elige <b>"Añadir a pantalla de inicio"</b>.
              </Dialog.Description>
              <Flex justify="end">
                <Dialog.Close>
                  <Button variant="soft" className="cursor-pointer">Entendido</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </div>
    </Section>
  );
}
