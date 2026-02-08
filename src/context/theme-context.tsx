"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type ThemeColor = {
  value: string; // HSL color value
  foreground: string; // HSL color value for text/icons on top of the primary color
};

const themeColors: { [key: string]: ThemeColor } = {
  "Venga Mor": {
    value: "337 85% 55%",
    foreground: "0 0% 100%",
  },
  "Cian Neón": {
    value: "180 85% 50%",
    foreground: "0 0% 0%",
  },
  "Violeta Eléctrico": {
    value: "270 90% 65%",
    foreground: "0 0% 100%",
  },
  "Lima Caliente": {
    value: "75 90% 50%",
    foreground: "0 0% 0%",
  },
};

export const themeColorNames = Object.keys(themeColors);

function getThemeColor(name: string): ThemeColor {
  return themeColors[name] || themeColors["Venga Mor"];
}

const defaultExploreBg = PlaceHolderImages.find(
  (p) => p.id === "explore-bg-default",
);

type ThemeContextType = {
  exploreBackground: string;
  setExploreBackground: (url: string) => void;
  resetExploreBackground: () => void;
  setThemeColor: (color: string) => void;
  bgOpacity: number;
  setBgOpacity: (opacity: number) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [exploreBackground, setExploreBackground] = useState(
    defaultExploreBg?.imageUrl || "",
  );

  const [bgOpacity, setBgOpacity] = useState(30);

  const setThemeColor = (colorName: string) => {
    const color = getThemeColor(colorName);
    document.documentElement.style.setProperty("--primary", color.value);
    document.documentElement.style.setProperty(
      "--primary-foreground",
      color.foreground,
    );
  };

  const setBackground = (url: string) => {
    setExploreBackground(url);
  };

  const resetBackground = () => {
    setExploreBackground(defaultExploreBg?.imageUrl || "");
  };

  return (
    <ThemeContext.Provider
      value={{
        exploreBackground,
        setExploreBackground: setBackground,
        resetExploreBackground: resetBackground,
        setThemeColor,
        bgOpacity,
        setBgOpacity,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
