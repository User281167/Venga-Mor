"use client";

import { Card, Flex, Heading, Spinner, Text } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";

import SectionImg from "@/components/section-img";
import { PlaceHolderImages } from "@/lib/placeholder-images";

import { RankingIntro } from "./components/ranking-intro";
import { RankingLegend } from "./components/ranking-legend";
import { RankingList } from "./components/ranking-list";
import { useRankingCollaborators } from "./hooks/use-ranking";

export default function RankingPage() {
  const bgImage = PlaceHolderImages.find((p) => p.id === "profile-bg");
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useRankingCollaborators();

  const collaborators = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  return (
    <>
      <RankingIntro open={showIntro} />

      <SectionImg imageUrl={bgImage?.imageUrl} imageHint={bgImage?.imageHint}>
        <Heading className="mb-6 text-center text-4xl font-bold text-primary md:text-5xl">
          Ranking Top Models
        </Heading>

        <Card className="mx-auto w-full max-w-4xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          {isLoading ? (
            <Flex justify="center" align="center" className="h-64 gap-3">
              <Spinner size="3" />
              <Text>Cargando ranking...</Text>
            </Flex>
          ) : (
            <RankingList
              title="Top Global"
              collaborators={collaborators}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={() => fetchNextPage()}
            />
          )}

          <RankingLegend />
        </Card>
      </SectionImg>
    </>
  );
}
