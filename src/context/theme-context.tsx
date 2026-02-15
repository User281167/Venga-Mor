"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { PlaceHolderImages, ImagePlaceholder } from "@/lib/placeholder-images";

const THEME_COLOR_KEY = "theme-color";
const THEME_OPACITY_KEY = "theme-opacity";
const THEME_BACKGROUND_IMAGE_KEY = "theme-background-image";

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
)!;

export const availableExploreBgs: ImagePlaceholder[] = [
  defaultExploreBg,
  PlaceHolderImages.find((p) => p.id === "intro-gif-2")!,
  PlaceHolderImages.find((p) => p.id === "chat-bg")!,
  PlaceHolderImages.find((p) => p.id === "explore-bg-3")!,
  PlaceHolderImages.find((p) => p.id === "explore-bg-4")!,
  PlaceHolderImages.find((p) => p.id === "info-bg")!,
].filter(Boolean);


type ThemeContextType = {
  exploreBackground: string;
  setExploreBackground: (url: string) => void;
  resetExploreBackground: () => void;
  setThemeColor: (color: string) => void;
  bgOpacity: number;
  setBgOpacity: (opacity: number) => void;
  availableExploreBgs: ImagePlaceholder[];
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

    localStorage.setItem(THEME_COLOR_KEY, colorName);
  };

  // carga inicial
  useEffect(() => {
    const savedColorName = localStorage.getItem(THEME_COLOR_KEY);
    if (savedColorName) {
      setThemeColor(savedColorName);
    } else {
      setThemeColor("Venga Mor");
    }

    const savedOpacity = localStorage.getItem(THEME_OPACITY_KEY);
    if (savedOpacity) {
      setBgOpacity(parseInt(savedOpacity, 10));
    }

    const savedBackground = localStorage.getItem(THEME_BACKGROUND_IMAGE_KEY);
    if (savedBackground) {
      setExploreBackground(savedBackground);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_OPACITY_KEY, bgOpacity.toString());
  }, [bgOpacity]);

  const setBackground = (url: string) => {
    setExploreBackground(url);
    localStorage.setItem(THEME_BACKGROUND_IMAGE_KEY, url);
  };

  const resetBackground = () => {
    setExploreBackground(defaultExploreBg?.imageUrl || "");
    localStorage.removeItem(THEME_BACKGROUND_IMAGE_KEY);
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
        availableExploreBgs,
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
