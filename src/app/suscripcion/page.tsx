"use client";
import Image from "next/image";
import Link from "next/link";
import PayPalPayment from "@/components/pay-pal";
import { Crown, CheckCircle2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button, Card, Flex, Heading, Section } from "@radix-ui/themes";

export default function SuscripcionPage() {
  const subscriptionBg = PlaceHolderImages.find(
    (p) => p.id === "subscription-bg",
  );

  const benefits = [
    "Perfiles ilimitados",
    "Chatea sin restricciones",
    "Fotos y videos exclusivos",
    "Filtros de búsqueda avanzados",
    "Modo incógnito",
  ];

  return (
    <Section className="relative min-h-screen min-w-full flex flex-col items-center justify-center px-4 text-center bg-primary/10 overflow-hidden">
      {subscriptionBg && (
        <Image
          src={subscriptionBg.imageUrl}
          alt="Suscripción Venga Mor"
          unoptimized
          priority
          className="absolute -z-10 h-screen w-full opacity-30 object-cover object-center"
          width={1920}
          height={1080}
        />
      )}

      <Heading
        className="text-5xl font-bold text-primary mb-4"
        style={{ fontFamily: "'Playball', cursive" }}
      >
        Suscripción Premium
      </Heading>

      <Card className="w-full max-w-md bg-card/80 border-primary shadow-lg">
        <Heading
          as="h2"
          className="flex items-center justify-center gap-2 text-2xl text-yellow-400"
        >
          <Crown className="h-8 w-8" />
          <span>Membresía Premium</span>
        </Heading>

        <Flex direction="column" gap="2" p="4">
          <ul className="space-y-3 text-left mb-6">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-accent mr-3" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <Flex direction="column" gap="2">
            <PayPalPayment />

            <Link
              href="https://mpago.li/2Z9He9g"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 md:py-6"
              >
                Pagar con Mercado Pago
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Card>
    </Section>
  );
}
