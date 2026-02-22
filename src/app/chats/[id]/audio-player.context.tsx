"use client";

import { createContext, useContext, useState } from "react";

interface AudioPlayerContextType {
  currentPlayingId: string | null;
  setCurrentPlayingId: (id: string | null) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  currentPlayingId: null,
  setCurrentPlayingId: () => {},
});

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  return (
    <AudioPlayerContext.Provider
      value={{ currentPlayingId, setCurrentPlayingId }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
