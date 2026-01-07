import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function PreferenciasPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Preferencias</h1>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-20">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">Sin Preferencias</h2>
            <p className="mt-2 text-muted-foreground">Tus perfiles favoritos aparecerán aquí.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
