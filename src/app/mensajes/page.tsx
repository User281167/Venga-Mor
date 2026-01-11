import { Card, Flex, Heading, Section } from "@radix-ui/themes";
import { MessageSquare } from "lucide-react";

export default function MensajesPage() {
  return (
    <Section className="flex flex-col gap-6">
      <Heading className="text-4xl font-bold text-primary mb-8 text-center">
        Mensajes
      </Heading>

      <Card className="flex flex-col gap-4 w-11/12 max-w-6xl mx-auto">
        <div className="text-center py-20">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />

          <Heading
            as="h2"
            className="mt-4 text-xl font-semibold text-foreground"
          >
            No tienes mensajes
          </Heading>

          <p className="mt-2 text-muted-foreground">
            Inicia una conversación para ver tus mensajes.
          </p>
        </div>
      </Card>
    </Section>
  );
}
