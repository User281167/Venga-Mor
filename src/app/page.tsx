"use client";
import Link from "next/link";
import { Button, Flex, Heading, Section, Dialog } from "@radix-ui/themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const introImages = [
    "https://i.ibb.co/4wx2qPMz/In-Shot-20260219-212506821.gif",
    "https://i.ibb.co/2Y6y6v94/69b7864d645a301516c9025e.gif",
    "https://i.ibb.co/FLYC1Qq8/69b869ba62b15dabc86e9faf.png",
    "https://i.ibb.co/jk9tgFjs/In-Shot-20251127-124506071.gif"
  ];

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosTip, setShowIosTip] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % introImages.length);
    }, 6000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, [introImages.length]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);
      if (isIos) {
        setShowIosTip(true);
      } else {
        alert('Busca la opción "Instalar App" en el menú de tu navegador.');
      }
    }
  };

  return (
    <Section className="relative h-screen w-full flex flex-col items-center justify-end p-0 overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 flex items-start justify-center"
        >
          <Image
            src={introImages[currentImgIndex]}
            alt="Venga Mor Intro"
            fill
            className="z-0 object-contain object-top"
            unoptimized
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradiente profundo para lectura de botones */}
      <div className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-t from-black via-black/95 to-transparent z-10" />

      <div className="relative z-20 w-full max-w-[420px] mx-auto p-4 flex flex-col items-center text-center pb-12 mb-2">
        <Heading
          className="text-8xl md:text-9xl font-headline text-primary mb-16 leading-none"
          style={{
            fontFamily: "'Playball', cursive",
            textShadow: "0px 0px 60px rgba(255,0,85,1)",
          }}
        >
          Venga Mor
        </Heading>

        <Flex direction="column" gap="4" className="w-full">
          <Link href="/iniciar-sesion" className="w-full">
            <Button
              size="4"
              className="w-full cursor-pointer bg-primary text-primary-foreground h-20 text-4xl font-bold rounded-2xl shadow-[0_0_40px_rgba(255,0,85,0.5)] transition-transform active:scale-95"
            >
              INGRESAR
            </Button>
          </Link>

          <Link href="/perfiles" className="w-full">
            <Button
              size="3"
              variant="ghost"
              className="w-full cursor-pointer h-14 text-2xl font-bold text-white hover:bg-white/10"
            >
              VER PERFILES
            </Button>
          </Link>

          <Button
            size="3"
            variant="outline"
            className="w-full cursor-pointer h-14 text-sm font-bold bg-black/40 border-white/20 text-white rounded-xl backdrop-blur-md"
            onClick={handleInstallClick}
          >
            <Download className="mr-2 h-4 w-4" />
            DESCARGAR APP
          </Button>

          <Dialog.Root open={showIosTip} onOpenChange={setShowIosTip}>
            <Dialog.Content style={{ maxWidth: 350 }} className="rounded-3xl bg-zinc-900 border border-white/10">
              <Dialog.Title className="text-white">Instalar en iPhone</Dialog.Title>
              <Dialog.Description size="2" mb="4" className="text-gray-300">
                1. Toca <b>Compartir</b> <img src="https://img.icons8.com/ios/18/ffffff/upload.png" alt="compartir" className="inline align-middle mx-1" />.<br />
                2. Selecciona <b>"Añadir a pantalla de inicio"</b>.
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
