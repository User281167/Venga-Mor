"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Heading, Spinner, Text } from "@radix-ui/themes";
import SectionImg from "@/components/section-img";

export default function ConfirmationPage() {
    const router = useRouter();
    const { user, loading } = useUser();

    useEffect(() => {
        if (loading) return; // Wait for user to be loaded

        if (!user) {
            router.replace("/iniciar-sesion");
            return;
        }

        // If already verified, go straight to success
        if (user.verificado) {
            router.replace("/exito-pago");
            return;
        }

        // Listen for changes on the user's document
        const unsub = onSnapshot(doc(db, "usuarios", user.uid), (doc) => {
            const userData = doc.data();
            if (userData?.verificado) {
                unsub(); // Stop listening
                router.replace("/exito-pago");
            }
        });

        return () => unsub(); // Cleanup listener on unmount
    }, [user, loading, router]);


    return (
        <SectionImg>
            <div className="text-center p-8 bg-card/80 rounded-lg shadow-lg">
                <Spinner size="3" />
                <Heading mt="4">Procesando tu verificación</Heading>
                <Text as="p" color="gray" mt="2">
                    Esto puede tardar unos segundos. Por favor, no cierres esta ventana.
                </Text>
            </div>
        </SectionImg>
    );
}
