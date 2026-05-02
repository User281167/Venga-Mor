"use client";

import {
  Card,
  Dialog,
  Flex,
  Grid,
  Heading,
  Text,
  Badge,
  Button,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Coins } from "lucide-react";
import JewelryPayPalButton from "./jewelry-paypal-button";
import { JEWELRY_PACKAGES } from "@/lib/jewelry";

interface Props {
  initialQuantity: number;
}

export default function JewelryModal({ initialQuantity }: Props) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    JEWELRY_PACKAGES[0].quantity,
  );
  const router = useRouter();

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const selectedPackage =
    JEWELRY_PACKAGES.find((pkg) => pkg.quantity === selectedQuantity) ??
    JEWELRY_PACKAGES[0];

  const handleSuccess = (addedQuantity: number) => {
    setQuantity((current) => current + addedQuantity);
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-amber-400">
          <Coins className="h-4 w-4" />
          <Text>Comprars joyas</Text>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content
        style={{ maxWidth: 720 }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl"
      >
        <Dialog.Title className="text-2xl font-semibold">Joyas</Dialog.Title>
        <Dialog.Description className="text-sm text-white/70">
          <Text>
            Compra la cantidad de joyas que desees y sumará al total actual.
          </Text>
        </Dialog.Description>

        <Flex
          justify="between"
          align="center"
          className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div>
            <Text size="2" className="text-white/60">
              Joyas actuales
            </Text>

            <Heading as="h3" className="mt-1 text-4xl text-amber-300">
              {quantity}
            </Heading>
          </div>

          <Badge color="gold" size="3">
            {quantity === 0 ? "Sin joyas" : "Activas"}
          </Badge>
        </Flex>

        <Grid columns={{ initial: "1", sm: "2" }} gap="3" className="mt-5">
          {JEWELRY_PACKAGES.map((pkg) => {
            const active = pkg.quantity === selectedQuantity;

            return (
              <Card
                key={pkg.quantity}
                className={`cursor-pointer border transition-all ${
                  active
                    ? "border-amber-300 bg-amber-300/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
                onClick={() => setSelectedQuantity(pkg.quantity)}
              >
                <Flex justify="between" align="center">
                  <div>
                    <Text size="2" className="text-white/60">
                      Paquete
                    </Text>

                    <Heading as="h4" className="text-xl">
                      {pkg.quantity} joyas
                    </Heading>
                  </div>

                  <Text size="4" className="font-semibold text-amber-200">
                    ${pkg.price.toFixed(2)}
                  </Text>
                </Flex>
              </Card>
            );
          })}
        </Grid>

        <Card className="mt-5 border border-white/10 bg-white/5">
          <Flex justify="between" align="center" gap="3">
            <div>
              <Text size="2" className="text-white/60">
                Compra seleccionada
              </Text>

              <Heading as="h4" className="text-xl">
                {selectedPackage.quantity} joyas
              </Heading>
            </div>

            <Text className="text-right text-2xl font-semibold text-white">
              ${selectedPackage.price.toFixed(2)}
            </Text>
          </Flex>
        </Card>

        <div className="mt-5">
          <JewelryPayPalButton
            quantity={selectedQuantity}
            onSuccess={handleSuccess}
          />
        </div>

        <Dialog.Close className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
          <Button>Cerrar</Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
}
