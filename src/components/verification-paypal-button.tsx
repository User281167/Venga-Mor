"use client";

import { PayPalScriptProvider, PayPalButtons, OnApproveData } from "@paypal/react-paypal-js";
import { ENV } from "@/lib/env";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  userId: string;
}

export default function VerificationPayPalButton({ userId }: Props) {
    const router = useRouter();

    const createOrder = (data: Record<string, unknown>, actions: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: "Verificación de Perfil - Venga Mor",
                    amount: {
                        currency_code: "USD",
                        value: "5.00", // Example price for verification
                    },
                    custom_id: userId,
                },
            ],
            application_context: {
                shipping_preference: "NO_SHIPPING",
            },
        });
    };

    const onApprove = (data: OnApproveData, actions: any) => {
        toast.success("Pago iniciado. Procesando verificación...");
        // It's better to rely on the webhook for the actual verification.
        // We redirect the user to a confirmation page.
        router.push(`/confirmacion`);
        return Promise.resolve();
    };

    const onError = (err: any) => {
        toast.error("Ocurrió un error con el pago. Por favor, inténtalo de nuevo.");
        console.error("PayPal Error:", err);
    };

    return (
        <PayPalScriptProvider
            options={{
                clientId: "test",
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
