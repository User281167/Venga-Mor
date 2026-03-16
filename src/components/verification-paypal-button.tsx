"use client";

import { PayPalScriptProvider, PayPalButtons, OnApproveData } from "@paypal/react-paypal-js";
import { ENV } from "@/lib/env";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  userId: string;
}

/**
 * BOTÓN DE VERIFICACIÓN
 * Envía el userId como 'custom_id' para que el Webhook sepa a quién activar.
 */
export default function VerificationPayPalButton({ userId }: Props) {
    const router = useRouter();

    const createOrder = (data: Record<string, unknown>, actions: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: "Verificación de Perfil Oficial - Venga Mor",
                    amount: {
                        currency_code: "USD",
                        value: "5.00", // Precio del servicio de verificación
                    },
                    custom_id: userId, // Vínculo crucial para el Webhook
                },
            ],
            application_context: {
                shipping_preference: "NO_SHIPPING",
            },
        });
    };

    const onApprove = (data: OnApproveData, actions: any) => {
        toast.success("Pago procesado. Tu perfil se activará en unos segundos.");
        router.push(`/confirmacion`);
        return Promise.resolve();
    };

    const onError = (err: any) => {
        toast.error("Error en la transacción. Intenta nuevamente.");
        console.error("PayPal Error:", err);
    };

    return (
        <PayPalScriptProvider
            options={{
                clientId: "test", // Reemplazar por ENV.PAYPAL_CLIENT_ID en producción
                intent: "capture",
                currency: "USD"
            }}
        >
            <PayPalButtons
                style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
            />
        </PayPalScriptProvider>
    );
}
