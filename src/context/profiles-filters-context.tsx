"use client";
import { createContext, useContext, useState, useRef, RefObject } from "react";
import { LocationData } from "@/types/location-data";

type FiltersContextType = {
  ageRange: number[];
  selectedCategories: string[];
  selectedStar: number;
  locationData: LocationData;
  setAgeRange: (v: number[]) => void;
  setLocationData: (v: LocationData) => void;
  setSelectedStar: (v: number) => void;
  toggleCategory: (c: string) => void;
  scrollContainerRef: RefObject<HTMLDivElement>;
};

const FiltersContext = createContext<FiltersContextType | null>(null);

export function ProfilesFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStar, setSelectedStar] = useState(0);
  const [locationData, setLocationData] = useState<LocationData>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <FiltersContext.Provider
      value={{
        ageRange,
        selectedCategories,
        selectedStar,
        locationData,
        setAgeRange,
        setLocationData,
        setSelectedStar,
        toggleCategory,
        scrollContainerRef,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export const useProfilesFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error(
      "useProfilesFilters must be used within ProfilesFiltersProvider",
    );
  }
  return context;
};
