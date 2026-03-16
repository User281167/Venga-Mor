
"use client";
import Link from "next/link";
import { Button, Flex, Heading, Section, Dialog } from "@radix-ui/themes";
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
    // Registro del Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registrado"))
        .catch((err) => console.log("Error registrando SW:", err));
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Rotación de GIFs
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
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('App instalada con éxito');
      }
      setDeferredPrompt(null);
    } else {
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
      {/* Background GIFs Rotativos */}
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
              layout="fill"
              objectFit="cover"
              objectPosition="top"
              className="z-0"
              unoptimized
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

      {/* Content container */}
      <div className="relative z-20 w-full max-w-sm mx-auto p-6 flex flex-col items-center text-center">
        <Heading
          className="text-8xl md:text-9xl font-headline text-primary mb-8"
          style={{
            fontFamily: "'Playball', cursive",
            textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          Venga Mor
        </Heading>

        <Flex direction="column" gap="3" className="w-full">
          <Link href="/iniciar-sesion" className="w-full">
            <Button
              size="3"
              className="w-full cursor-pointer bg-primary text-primary-foreground h-12 text-lg font-semibold"
            >
              Ingresar
            </Button>
          </Link>

          <Link href="/perfiles" className="w-full">
            <Button
              size="3"
              variant="soft"
              className="w-full cursor-pointer h-12 text-lg font-semibold bg-black/50 text-white"
            >
              Ver perfiles
            </Button>
          </Link>

          <Button
            size="3"
            variant="outline"
            className="w-full cursor-pointer h-12 text-lg font-semibold bg-black/30 border-primary text-white"
            onClick={handleInstallClick}
          >
            <Download className="mr-2 h-5 w-5" />
            Descargar App
          </Button>

          <Dialog.Root open={showIosTip} onOpenChange={setShowIosTip}>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>Instalar en tu iPhone</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                Para instalar la app en tu menú: Toca el icono de compartir{" "}
                <img
                  src="https://img.icons8.com/ios/18/ffffff/upload.png"
                  alt="compartir"
                  className="inline align-middle mx-1"
                />{" "}
                en tu navegador Safari y elige la opción <b>"Añadir a pantalla de inicio"</b>.
              </Dialog.Description>
              <Flex justify="end">
                <Dialog.Close>
                  <Button variant="soft">Entendido</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </div>
    </Section>
  );
}
