"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Collaborator } from "@/types/collaborator";
import { useProfiles } from "@/context/profiles-context";
import { Spinner } from "@radix-ui/themes";
import ProfileDetail from "./profile-details";

export default function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProfileById } = useProfiles();

  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setLoading(true);

    getProfileById(id).then((data) => {
      if (!active) return;

      if (!data) {
        setCollaborator(null);
      } else {
        setCollaborator(data);
      }

      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [id, getProfileById]);

  if (loading) {
    // return <ProfileSkeleton />;
    return <Spinner />;
  }

  if (!collaborator) {
    notFound();
  }

  // Render normal
  return <ProfileDetail collaborator={collaborator} />;
}
