
"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ENV } from "@/lib/env";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  userId: string;
}

export default function VerificationPayPalButton({ userId }: Props) {
    const router = useRouter();

    const createOrder = async () => {
        try {
            const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const order = await response.json();
            return order.id;
        } catch (error) {
            console.error("Error calling create-order API:", error);
            toast.error("No se pudo iniciar el proceso de pago.");
        }
    };

    const onApprove = async (data: any) => {
        try {
            const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID }),
            });
            const details = await response.json();
            
            if (details.status === "COMPLETED") {
                toast.success("¡Verificación completada con éxito!");
                router.push("/confirmacion");
            } else {
                toast.error("El pago no se pudo completar.");
            }
        } catch (error) {
            console.error("Error calling capture-order API:", error);
            toast.error("Error al procesar la confirmación del pago.");
        }
    };

    return (
        <PayPalScriptProvider
            options={{
                clientId: ENV.PAYPAL_CLIENT_ID || "test",
                intent: "capture",
                currency: "USD"
            }}
        >
            <PayPalButtons
                style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                    toast.error("Hubo un problema con la transacción.");
                    console.error("PayPal Error:", err);
                }}
            />
        </PayPalScriptProvider>
    );
}
