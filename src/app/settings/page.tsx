import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const settingsOptions = [
    { label: "Notificaciones" },
    { label: "Privacidad y Seguridad" },
    { label: "Idioma" },
    { label: "Soporte" },
];

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Ajustes y Soporte</h1>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {settingsOptions.map((option) => (
              <li key={option.label}>
                <Button variant="ghost" className="w-full justify-between h-14 px-4 text-lg">
                  <span>{option.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
