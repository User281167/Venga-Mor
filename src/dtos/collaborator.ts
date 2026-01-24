import { Collaborator } from "@/types/collaborator";
import { LocationData } from "@/types/location-data";

export type CollaboratorResDto = {
  data: Collaborator[];
  lastId: string | null;
  hasMore: boolean;
};
