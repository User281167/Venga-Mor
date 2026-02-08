"use client";

import { Card } from "@radix-ui/themes";
import { Separator } from "@radix-ui/themes/components/separator";

import SectionImg from "@/components/section-img";

import RaitingCollaborator from "./raiting/raitingButton";
import PostCarousel from "./posts/post-carousel";
import Comments from "./comments/comments";

import ProfileActions from "./profile-actions";
import ProfileHeader from "./profile-header";
import ProfileAbout from "./profile-about";

import { Collaborator } from "@/types/collaborator";
import { useUser } from "@/context/user-context";

export default function ProfileDetail({
  collaborator,
}: {
  collaborator: Collaborator;
}) {
  const { user } = useUser();

  return (
    <SectionImg>
      <Card
        className="container max-w-7xl bg-card/30 mx-auto flex flex-col gap-4"
        size="3"
      >
        <ProfileHeader collaborator={collaborator} />
        <ProfileActions collaborator={collaborator} />
        <Separator size="4" />

        <ProfileAbout collaborator={collaborator} />
        <Separator size="4" />

        <PostCarousel id={collaborator.uid} />
        <Separator size="4" />

        {user?.uid !== collaborator.uid && (
          <>
            <RaitingCollaborator collaboratorId={collaborator.uid} />
            <Separator my="3" size="4" />
          </>
        )}

        <Comments collaboratorId={collaborator.uid} />
      </Card>
    </SectionImg>
  );
}
