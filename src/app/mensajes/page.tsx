import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function MensajesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Mensajes</h1>
       <Card>
        <CardContent className="pt-6">
          <div className="text-center py-20">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">No tienes mensajes</h2>
            <p className="mt-2 text-muted-foreground">Inicia una conversación para ver tus mensajes.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
