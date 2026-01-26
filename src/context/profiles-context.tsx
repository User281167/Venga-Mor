"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LocationData } from "@/types/location-data";
import { Collaborator } from "@/types/collaborator";
import { getProfiles } from "@/app/perfiles/profiles-handler";
import { getCollaborator } from "@/handlers/getPublicCollaborator";

type ProfilesContextType = {
  // Lista
  profiles: Collaborator[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;

  // Filtros
  ageRange: number[];
  selectedCategories: string[];
  selectedStar: number;
  locationData: LocationData;
  setAgeRange: (v: number[]) => void;
  setLocationData: (v: LocationData) => void;
  setSelectedStar: (v: number) => void;
  toggleCategory: (c: string) => void;

  // Perfil individual
  getProfileById: (id: string) => Promise<Collaborator | null>;
};

const ProfilesContext = createContext<ProfilesContextType | null>(null);

export function ProfilesProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Collaborator[]>([]);
  const [profilesById, setProfilesById] = useState<
    Record<string, Collaborator>
  >({});

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<string | null>(null);

  // filtros
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStar, setSelectedStar] = useState(0);
  const [locationData, setLocationData] = useState<LocationData>({});

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const fetchProfiles = async (reset: boolean) => {
    if (!hasMore && !reset) return;

    setLoading(true);

    const result = await getProfiles(
      ageRange[0],
      ageRange[1],
      selectedCategories,
      locationData,
      reset ? null : lastId,
    );

    setLoading(false);

    if (!result.success || !result.data) return;

    const dto = result.data;

    setProfiles((prev) => (reset ? dto.data : [...prev, ...dto.data]));
    setHasMore(dto.hasMore);
    setLastId(dto.lastId);

    // cache por ID
    setProfilesById((prev) => {
      const next = { ...prev };

      dto.data.forEach((p) => {
        next[p.uid] = p;
      });

      return next;
    });
  };

  useEffect(() => {
    console.log("useEffect");
    fetchProfiles(true);
  }, [ageRange, selectedCategories, selectedStar, locationData]);

  const loadMore = () => fetchProfiles(false);

  const getProfileById = async (id: string): Promise<Collaborator | null> => {
    if (profilesById[id]) return profilesById[id];

    const fromList = profiles.find((p) => p.uid === id);
    if (fromList) {
      setProfilesById((prev) => ({ ...prev, [id]: fromList }));
      return fromList;
    }

    const res = await getCollaborator(id);
    if (!res.success || !res.data) return null;

    setProfilesById((prev) => {
      if (prev[id]) return prev;
      if (!res.data) return prev;

      const next = { ...prev };
      next[res.data?.uid] = res.data;
      return next;
    });

    return res.data;
  };

  return (
    <ProfilesContext.Provider
      value={{
        profiles,
        loading,
        hasMore,
        loadMore,

        ageRange,
        selectedCategories,
        selectedStar,
        locationData,
        setAgeRange,
        setLocationData,
        setSelectedStar,
        toggleCategory,

        getProfileById,
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
}

export const useProfiles = () => {
  const context = useContext(ProfilesContext);
  if (!context) {
    throw new Error("useProfiles must be used within ProfilesProvider");
  }
  return context;
};
