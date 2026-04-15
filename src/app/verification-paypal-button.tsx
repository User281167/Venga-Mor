"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ENV } from "@/lib/env";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Props {
  userId: string;
}

export default function VerificationPayPalButton({ userId }: Props) {
    const router = useRouter();

    const createOrder = async (data: any, actions: any) => {
        // Usamos el flujo de servidor para máxima seguridad
        try {
            const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }), // Este userId se usará como custom_id en el servidor
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
                // Actualización inmediata en el cliente para mejor UX
                const userRef = doc(db, "usuarios", userId);
                const colabRef = doc(db, "colaboradores", userId);
                
                await updateDoc(userRef, { verificado: true });
                try {
                    await updateDoc(colabRef, { verificado: true });
                } catch(e) {
                    console.log("Documento de colaborador no existe aún o error menor.");
                }

                toast.success("¡Verificación completada con éxito!");
                router.push("/confirmacion");
            } else {
                toast.error("El pago no se pudo completar.");
            }
        } catch (error) {
            console.error("Error confirmando pago:", error);
            toast.error("Error al procesar la confirmación.");
        }
    };

    return (
        <PayPalScriptProvider
            options={{
                clientId: "ASWoUY2hASGLV457PLVjFP-GpQHdyFUQjfs07h7NnzvuAeMRUiz2GOa_347qPhsvKqAJk9U-ukrRXG_6",
                intent: "capture",
                currency: "USD"
            }}
        >
            <PayPalButtons
                style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
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
