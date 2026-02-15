
"use client";
import {
  ChevronDown,
  MapPin,
  Star,
  Menu,
  Crown,
  User,
  HelpCircle,
  Diamond,
  FilterIcon,
  Trophy,
} from "lucide-react";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  DropdownMenu,
  Flex,
  Grid,
  Heading,
  Popover,
  Slider,
  Text,
  TextField,
} from "@radix-ui/themes";
import Link from "next/link";

import { WhatsappIcon } from "@/components/icons";
import PayPalPayment from "@/components/pay-pal";
import SectionImg from "@/components/section-img";

import { categorias } from "@/types/categorias";
import {
  ProfilesFiltersProvider,
  useProfilesFilters,
} from "@/context/profiles-filters-context";
import { useProfilesList } from "@/context/use-profiles-data";
import { toast } from "sonner";
import ProfileCardSkeleton from "./profileCardSkeleton";
import { useTheme } from "@/context/theme-context";
import { useEffect, useRef } from "react";
import { CollaboratorCard } from "./profile-card";

function ProfilesPageContent() {
  const {
    ageRange,
    setAgeRange,
    selectedStar,
    selectedCategories,
    setSelectedStar,
    locationData,
    setLocationData,
    toggleCategory,
    scrollContainerRef,
  } = useProfilesFilters();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useProfilesList(ageRange, selectedCategories, selectedStar, locationData);

  const { exploreBackground } = useTheme();
  const profiles = data?.pages.flatMap((page) => page?.data || []) ?? [];

  const playCountRef = useRef(
    typeof window !== "undefined"
      ? parseInt(sessionStorage.getItem("audioPlayCount") || "0")
      : 0,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/WhatsApp%20Audio%202026-02-12%20at%2012.16.10%20AM.mp3?alt=media&token=53ba1088-1204-4cfb-8248-990223950a90",
    );
    audio.preload = "auto";

    const playAudioLimited = () => {
      if (playCountRef.current < 3) {
        audio.play().catch((error) => {
          // Fail silently
        });
        playCountRef.current++;
        sessionStorage.setItem(
          "audioPlayCount",
          playCountRef.current.toString(),
        );
      }
    };

    const container = document.getElementById("profiles-page-container");
    if (container && playCountRef.current < 3) {
      const handler = () => {
        playAudioLimited();
        container.removeEventListener("click", handler);
        container.removeEventListener("keydown", handler);
      };
      container.addEventListener("click", handler);
      container.addEventListener("keydown", handler);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, scrollContainerRef]);

  if (isError) {
    toast.error(error.message);
  }

  return (
    <>
      <SectionImg
        id="profiles-page-container"
        imageUrl={exploreBackground}
        imageHint="woman neon"
      >
        <header className="fixed top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          <Heading className="text-2xl md:text-4xl font-bold font-headline text-primary">
            VENGA MOR
          </Heading>

          <Flex gap="2" align="center">
            <Dialog.Root>
              <Dialog.Trigger>
                <Button variant="soft">
                  <FilterIcon className="h-4 w-4" /> Filtros
                </Button>
              </Dialog.Trigger>
              <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>Filtros</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                  Encuentra tu perfil ideal.
                </Dialog.Description>
                <Flex direction="column" gap="4">
                  <div>
                    <Text
                      as="label"
                      htmlFor="age-range"
                      className="text-lg font-semibold text-primary mb-3 block"
                    >
                      Rango de Edad:{" "}
                      <span className="text-white">
                        {ageRange[0]} - {ageRange[1]}
                      </span>
                    </Text>
                    <Slider
                      id="age-range"
                      min={18}
                      max={60}
                      step={1}
                      value={ageRange}
                      onValueChange={(value) => setAgeRange(value)}
                      className="[&>span:first-child]:h-2 [&>span>span]:bg-primary"
                    />
                  </div>

                  <div>
                    <Text
                      as="label"
                      className="text-lg font-semibold text-primary mb-3 block"
                    >
                      Categorías
                    </Text>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categorias.map((category) => (
                        <Flex asChild key={category} align="center" gap="2">
                          <label>
                            <Checkbox
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <Text size="2" className="capitalize">
                              {category}
                            </Text>
                          </label>
                        </Flex>
                      ))}
                    </div>
                  </div>

                  <Popover.Root>
                    <Popover.Trigger>
                      <Button
                        variant="outline"
                        className="bg-card border-primary text-white"
                      >
                        <MapPin className="mr-2 h-4 w-4" /> Ciudad
                      </Button>
                    </Popover.Trigger>
                    <Popover.Content maxWidth="90%" width="360px">
                      <Grid columns={{ sm: "1" }} gap="2">
                        <Text as="label">País</Text>
                        <TextField.Root
                          type="text"
                          value={locationData?.pais || ""}
                          onChange={(e) =>
                            setLocationData({
                              ...locationData,
                              pais: e.target.value,
                            })
                          }
                        />
                        <Text as="label">Estado / Región</Text>
                        <TextField.Root
                          type="text"
                          value={locationData?.estado_region || ""}
                          onChange={(e) =>
                            setLocationData({
                              ...locationData,
                              estado_region: e.target.value,
                            })
                          }
                        />
                        <Text as="label">Ciudad / Localidad</Text>
                        <TextField.Root
                          type="text"
                          value={locationData?.ciudad_localidad || ""}
                          onChange={(e) =>
                            setLocationData({
                              ...locationData,
                              ciudad_localidad: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </Popover.Content>
                  </Popover.Root>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button
                        variant="outline"
                        className="bg-card border-primary text-white "
                      >
                        <Star className="mr-2 h-4 w-4" /> Calificación{" "}
                        {selectedStar === 0 ? "" : selectedStar}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="bg-card border-primary text-white">
                      {[0, 5, 4, 3, 2, 1].map((starValue) => (
                        <DropdownMenu.Item
                          key={starValue}
                          onClick={() => setSelectedStar(starValue)}
                        >
                          {starValue === 0
                            ? "Cualquiera"
                            : `${starValue} Estrella(s)`}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Flex>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      Cerrar
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>

            <Link href="/suscripcion">
              <Crown className="h-8 w-8 text-yellow-400" />
            </Link>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost" size="1">
                  <Menu className="h-8 w-8 text-white" />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content>
                <DropdownMenu.Item>
                  <Link href="/ranking" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" /> Top Global
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Link href="/lovi" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Lovi Venga Mor
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <Dialog.Root>
                  <Dialog.Trigger>
                    <div className="flex items-center gap-2 w-full px-2 py-1 text-sm rounded-md hover:bg-white/10 cursor-pointer">
                      <HelpCircle className="h-4 w-4" />
                      <span>¿Por qué Venga Mor?</span>
                    </div>
                  </Dialog.Trigger>

                  <Dialog.Content style={{ maxWidth: 450 }}>
                    <Dialog.Title>¿Por qué Venga Mor?</Dialog.Title>

                    <Dialog.Description size="2" mb="4">
                      Para acercar personas, para la soledad individual y el
                      calor del amor. Servicios intensos con consentimiento y
                      profesionales del amor.
                    </Dialog.Description>

                    <Flex justify="end">
                      <Dialog.Close>
                        <Button variant="soft">Cerrar</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>

                <Dialog.Root>
                  <Dialog.Trigger>
                    <div className="flex items-center gap-2 w-full px-2 py-1 text-sm rounded-md hover:bg-white/10 cursor-pointer">
                      <Diamond className="h-4 w-4" />
                      <span>Comprar Joyas</span>
                    </div>
                  </Dialog.Trigger>

                  <Dialog.Content style={{ maxWidth: 450 }}>
                    <Dialog.Title>Comprar Joyas</Dialog.Title>

                    <Dialog.Description size="2" mb="4">
                      Apoya a tus perfiles favoritos enviándoles joyas.
                    </Dialog.Description>

                    <PayPalPayment />

                    <Flex mt="4" justify="end">
                      <Dialog.Close>
                        <Button variant="soft">Cerrar</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>

                <DropdownMenu.Separator />

                <DropdownMenu.Item asChild>
                  <a
                    href="https://wa.me/573117744704?text=necesito%20soporte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <WhatsappIcon className="h-4 w-4" /> Soporte
                  </a>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </header>

        <div
          id="profiles-scroll-container"
          ref={scrollContainerRef}
          className="w-full h-screen overflow-y-auto scroll-snap-y-mandatory"
        >
          {isLoading &&
            Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="scroll-snap-center w-full h-screen flex items-center justify-center p-4"
              >
                <div className="w-full max-w-md h-[80vh]">
                  <ProfileCardSkeleton />
                </div>
              </div>
            ))}

          {!isLoading &&
            profiles.length > 0 &&
            profiles.map((profile, index) => (
              <div
                key={`${profile.uid}-${index}`}
                className="scroll-snap-center w-full h-screen flex items-center justify-center p-4"
              >
                <div className="w-full max-w-md h-[80vh]">
                  <CollaboratorCard collaborator={profile} />
                </div>
              </div>
            ))}

          {hasNextPage && !isFetchingNextPage && (
            <div
              key="loader"
              className="scroll-snap-center w-full h-screen flex items-center justify-center"
            >
              <Text color="gray">Cargando más perfiles...</Text>
            </div>
          )}

          {!isLoading && profiles.length === 0 && (
            <div
              key="not-found"
              className="scroll-snap-center w-full h-screen flex items-center justify-center p-4"
            >
              <Card className="bg-card/80">
                <Text color="gray">
                  No se encontraron perfiles con esos criterios. Prueba con
                  otros filtros.
                </Text>
              </Card>
            </div>
          )}
        </div>
      </SectionImg>
    </>
  );
}

export default function ProfilesPage() {
  return (
    <ProfilesFiltersProvider>
      <ProfilesPageContent />
    </ProfilesFiltersProvider>
  );
}
