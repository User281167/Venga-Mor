import { Button, Card, Heading, Section } from "@radix-ui/themes";
import { ChevronRight } from "lucide-react";

const settingsOptions = [
  { label: "Notificaciones" },
  { label: "Privacidad y Seguridad" },
  { label: "Idioma" },
  { label: "Soporte" },
];

export default function SettingsPage() {
  return (
    <Section className="flex flex-col gap-6">
      <Heading className="text-4xl font-bold text-primary mb-8 text-center">
        Ajustes y Soporte
      </Heading>

      <Card className="flex flex-col gap-4 w-11/12 max-w-4xl mx-auto">
        <ul className="divide-y divide-border">
          {settingsOptions.map((option) => (
            <li key={option.label}>
              <Button
                variant="ghost"
                className="w-full justify-between h-14 px-4 text-lg"
              >
                <span>{option.label}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </Section>
  );
}
