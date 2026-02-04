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
import { Label } from "radix-ui";
import Link from "next/link";

import { WhatsappIcon } from "@/components/icons";
import PayPalPayment from "@/components/pay-pal";
import SectionImg from "@/components/section-img";

import { categorias } from "@/types/categorias";

import { CollaboratorCard } from "./profile-card";
import { useProfilesFilters } from "@/context/profiles-filters-context";
import { useProfilesList } from "@/context/use-profiles-data";
import { toast } from "sonner";
import ProfileCardSkeleton from "./profileCardSkeleton";

export default function ProfilesPage() {
  const {
    ageRange,
    setAgeRange,
    selectedStar,
    selectedCategories,
    setSelectedStar,
    locationData,
    setLocationData,
    toggleCategory,
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

  const profiles = data?.pages.flatMap((page) => page.data) ?? [];

  if (isError) {
    toast.error(error.message);
  }

  return (
    <SectionImg imageUrl="https://i.ibb.co/VYVzBLXq/lamiendo-labios-letrero-neon-1262-21356.jpg">
      <Flex direction="column" gap="4" className="mx-auto w-11/12 max-w-3xl">
        <header className="flex items-center justify-between">
          <Heading className="text-4xl font-bold font-headline text-primary">
            VENGA MOR
          </Heading>

          <Flex gap="2">
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

        <Card className="bg-transparent border-0 text-center">
          <Text as="p" className="text-lg text-white/90">
            Bienvenido a Venga Mor, tu espacio exclusivo para conectar con
            acompañantes de élite en un ambiente de total privacidad y
            discreción
          </Text>
        </Card>

        <Card className="bg-card/80 border-0 grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <div>
            <Label.Root
              htmlFor="age-range"
              className="text-lg font-semibold text-accent mb-3 block"
            >
              Rango de Edad:{" "}
              <span className="text-white">
                {ageRange[0]} - {ageRange[1]}
              </span>
            </Label.Root>

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
            <Label.Root className="text-lg font-semibold text-accent mb-3 block">
              Categorías
            </Label.Root>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categorias.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    onClick={(e) => {
                      toggleCategory(category);
                    }}
                    id={category}
                    className="border-primary data-[state=checked]:bg-primary"
                  />

                  <Label.Root
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize text-white"
                  >
                    {category}
                  </Label.Root>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Flex wrap="wrap" gap="2" align="center">
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
              <Grid columns={{ sm: "1", md: "2" }} gap="2">
                <Label.Root>País</Label.Root>

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

                <Label.Root>Estado / Región</Label.Root>

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

                <Label.Root>Ciudad / Localidad</Label.Root>

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
              <DropdownMenu.Item onClick={() => setSelectedStar(0)}>
                Cualquiera
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setSelectedStar(5)}>
                5 Estrellas
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setSelectedStar(4)}>
                4 Estrellas
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setSelectedStar(3)}>
                3 Estrellas
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setSelectedStar(2)}>
                2 Estrellas
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setSelectedStar(1)}>
                1 Estrellas
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>

        <Flex direction="column" gap="4">
          {isLoading &&
            Array.from({ length: 2 }).map((_, index) => (
              <ProfileCardSkeleton key={index} />
            ))}

          {profiles.map((profile) => (
            <CollaboratorCard
              key={profile.uid + profile.nombre}
              collaborator={profile}
            />
          ))}
        </Flex>

        <Button
          hidden={!hasNextPage}
          disabled={isFetchingNextPage}
          loading={isLoading || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          Cargar más
        </Button>
      </Flex>
    </SectionImg>
  );
}
