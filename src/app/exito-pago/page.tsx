"use client";

import Link from 'next/link';
import Confetti from '@/components/confetti';
import { Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { PartyPopper, CheckCircle } from 'lucide-react';
import SectionImg from '@/components/section-img';

export default function SuccessPage() {
  return (
    <SectionImg>
        <Confetti />
        <Card className="text-center p-8 bg-card/80 rounded-lg shadow-lg">
            <Flex direction="column" align="center" gap="4">
                <PartyPopper className="h-16 w-16 text-primary" />
                <Heading>¡Felicidades! Perfil Verificado</Heading>
                <Text as="p" color="gray">
                    Tu pago se ha procesado correctamente y tu perfil ahora muestra la insignia de verificación.
                </Text>
                <CheckCircle className="h-20 w-20 text-green-500" />
                <Button asChild size="3" mt="4">
                    <Link href="/perfil">Volver a mi Perfil</Link>
                </Button>
            </Flex>
        </Card>
    </SectionImg>
  );
}
