import SectionImg from "@/components/section-img";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { adminDb } from "@/lib/firebase-admin-connection";
import { getUserID } from "@/app/api/utils";
import { redirect } from "next/navigation";
import { Badge, Card, Flex, Heading, Text } from "@radix-ui/themes";
import JewelryModal from "./jewelryModal";

export default async function JewelryPage() {
  const uid = await getUserID();

  if (!uid) {
    redirect("/iniciar-sesion");
  }

  const bgImage = PlaceHolderImages.find((p) => p.id === "profile-bg");
  const jewelrySnap = await adminDb.collection("userJewelry").doc(uid).get();
  const quantity = Number(jewelrySnap.data()?.quantity ?? 0);

  return (
    <SectionImg imageUrl={bgImage?.imageUrl} imageHint={bgImage?.description}>
      <div className="w-full max-w-3xl px-4 text-left">
        <Heading className="mb-4 text-center text-4xl font-bold text-primary">
          Joyas
        </Heading>

        <Card className="border-white/10 bg-zinc-950/75 p-6 text-white shadow-2xl backdrop-blur-xl">
          <Flex justify="between" align="center" gap="4" className="mb-5">
            <div>
              <Text size="2" className="text-white/60">
                Total actual
              </Text>
              <Heading as="h2" className="text-5xl text-amber-300">
                {quantity}
              </Heading>
            </div>
            <Badge color="gold" size="3">
              {quantity === 0 ? "Sin compras" : "Saldo activo"}
            </Badge>
          </Flex>

          <Text className="text-white/70">Compra paquetes de joyas.</Text>

          <div className="mt-6">
            <JewelryModal initialQuantity={quantity} />
          </div>
        </Card>
      </div>
    </SectionImg>
  );
}
