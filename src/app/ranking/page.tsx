import { Card, Heading, Section, Text } from "@radix-ui/themes";
import { Trophy } from "lucide-react";
import SectionImg from "@/components/section-img";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function RankingPage() {
    const bgImage = PlaceHolderImages.find((p) => p.id === "profile-bg");

    return (
        <SectionImg imageUrl={bgImage?.imageUrl} imageHint={bgImage?.imageHint}>
            <Heading className="text-4xl font-bold text-primary mb-8 text-center">
                Ranking Top Models
            </Heading>
            <Card className="flex flex-col gap-4 w-11/12 max-w-4xl mx-auto bg-card/80">
                <div className="text-center py-20">
                    <Trophy className="mx-auto h-12 w-12 text-yellow-400" />
                    <Heading as="h2" className="mt-4 text-xl font-semibold text-foreground">
                        Próximamente
                    </Heading>
                    <Text as="p" className="mt-2 text-muted-foreground">
                        Estamos trabajando en el ranking de los mejores perfiles. ¡Vuelve pronto!
                    </Text>
                </div>
            </Card>
        </SectionImg>
    );
}
