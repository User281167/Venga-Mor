import { CollaboratorDto } from "@/dtos/collaborator";
import { LocationData } from "@/types/location-data";
import { useEffect, useState } from "react";
import { getProfiles } from "./profiles-handler";

export function useProfilesFilter() {
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedStar, setSelectedStar] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [locationData, setLocationData] = useState<LocationData>({});
  const [profiles, setProfiles] = useState<CollaboratorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
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

    if (result.success && result.data) {
      const dto = result.data;

      setProfiles((prev) => (reset ? dto.data : [...prev, ...dto.data]));
      setHasMore(dto.hasMore);
      setLastId(dto.lastId);
    }

    if (!result.success) {
      setError(result.message);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setLastId(null);
      setHasMore(true);
      fetchProfiles(true);
    }, 3000);

    return () => clearTimeout(handler);
  }, [ageRange, selectedCategories, locationData]);

  useEffect(() => {
    fetchProfiles(false);
  }, []);

  const loadMoreHandle = () => {
    fetchProfiles(false);
  };

  return {
    ageRange,
    selectedStar,
    setAgeRange,
    selectedCategories,
    handleCategoryChange,
    locationData,
    setLocationData,
    setSelectedStar,
    profiles,
    loading,
    error,
    hasMore,
    loadMoreHandle,
  };
}
