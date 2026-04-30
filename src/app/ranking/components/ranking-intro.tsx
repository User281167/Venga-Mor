"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export function RankingIntro({ open }: { open: boolean }) {
  const introGifUrl = "https://i.ibb.co/bg5CphYS/69b78cc3622710ffba2f3c71.gif";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-black"
        >
          <div className="relative h-full w-full">
            <Image
              src={introGifUrl}
              alt="Ranking intro"
              fill
              className="object-cover"
              unoptimized
              priority
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <h1
                className="px-4 text-center text-5xl font-bold text-primary md:text-8xl"
                style={{ fontFamily: "'Playball', cursive" }}
              >
                Top Global
              </h1>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
