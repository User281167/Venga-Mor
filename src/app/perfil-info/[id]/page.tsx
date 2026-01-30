"use client";

import { notFound, useParams } from "next/navigation";
import ProfileDetail from "./profile-details";
import { ProfileSkeleton } from "./profile-skeleton";
import { useProfile } from "@/context/use-profiles-data";

export default function ProfileDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // Si no hay ID, redirige a 404
  if (!id) {
    notFound();
  }

  const { data: collaborator, isLoading, isError } = useProfile(id);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !collaborator) {
    notFound();
  }

  return <ProfileDetail collaborator={collaborator} />;
}
