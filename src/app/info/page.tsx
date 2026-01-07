
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, FileText, Shield } from "lucide-react";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function InfoPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'info-bg');

  return (
     <div className="relative min-h-[calc(100vh-128px)] -mx-4 -my-8 flex flex-col justify-center">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          layout="fill"
          objectFit="cover"
          unoptimized
          className="absolute z-0 opacity-20"
          data-ai-hint={bgImage.imageHint}
        />
      )}
      <div className="relative z-10 p-4">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">Información</h1>
        <div className="space-y-6">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-6 w-6 text-accent" />
                <span>Compartir la App</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                ¿Te gusta nuestra app? ¡Compártela con tus amigos!
              </p>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Compartir ahora</Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-accent" />
                <span>Términos y Condiciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Lee nuestros términos de servicio y políticas de uso.
              </p>
              <Button variant="outline" className="w-full">Leer Términos</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-accent" />
                <span>Política de Privacidad</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Tu privacidad es importante. Conoce cómo manejamos tus datos.
              </p>
              <Button variant="outline" className="w-full">Leer Política</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
