'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const defaultExploreBg = PlaceHolderImages.find(p => p.id === 'explore-bg-default');

type ThemeContextType = {
  exploreBackground: string;
  setExploreBackground: (url: string) => void;
  resetExploreBackground: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  bgOpacity: number;
  setBgOpacity: (opacity: number) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [exploreBackground, setExploreBackground] = useState(defaultExploreBg?.imageUrl || '');
  const [primaryColor, setPrimaryColor] = useState('337 85% 55%'); // Default Venga Mor color
  const [bgOpacity, setBgOpacity] = useState(30);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
  }, [primaryColor]);

  const setBackground = (url: string) => {
    setExploreBackground(url);
  };

  const resetBackground = () => {
    setExploreBackground(defaultExploreBg?.imageUrl || '');
  };

  return (
    <ThemeContext.Provider value={{ 
        exploreBackground, 
        setExploreBackground: setBackground, 
        resetExploreBackground: resetBackground,
        primaryColor,
        setPrimaryColor,
        bgOpacity,
        setBgOpacity
    }}>
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
