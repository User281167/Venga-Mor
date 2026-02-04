'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const defaultExploreBg = PlaceHolderImages.find(p => p.id === 'explore-bg-default');

type ThemeContextType = {
  exploreBackground: string;
  setExploreBackground: (url: string) => void;
  resetExploreBackground: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [exploreBackground, setExploreBackground] = useState(defaultExploreBg?.imageUrl || '');

  const setBackground = (url: string) => {
    setExploreBackground(url);
  };

  const resetBackground = () => {
    setExploreBackground(defaultExploreBg?.imageUrl || '');
  };

  return (
    <ThemeContext.Provider value={{ exploreBackground, setExploreBackground: setBackground, resetExploreBackground: resetBackground }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
