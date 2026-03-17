"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
            
            const data = await response.json();
            
            // 🔥 SOLUCIÓN CRÍTICA: Debemos devolver data.id para que el SDK de PayPal funcione
            if (!data.id) {
                console.error("Error: No se recibió ID de orden de PayPal", data);
                toast.error("Error al generar la orden de pago.");
                throw new Error("No order ID returned from server");
            }

            console.log("Orden capturada correctamente en el cliente:", data.id);
            return data.id; 
        } catch (error) {
            console.error("Error en createOrder del frontend:", error);
            throw error;
        }
    };

    const onApprove = async (data: any) => {
        try {
            toast.message("Procesando pago...");
            
            const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID }),
            });
            
            const details = await response.json();
            
            if (details.status === "COMPLETED") {
                // Actualización inmediata en el cliente para UX fluida
                const userRef = doc(db, "usuarios", userId);
                const colabRef = doc(db, "colaboradores", userId);
                
                await updateDoc(userRef, { verificado: true });
                try {
                    await updateDoc(colabRef, { verificado: true });
                } catch(e) {
                    console.warn("Sincronización menor: Perfil de colaborador pendiente.");
                }

                toast.success("¡Tu perfil ha sido verificado con éxito!");
                router.push("/confirmacion");
            } else {
                toast.error("El pago no pudo ser completado.");
            }
        } catch (error) {
            console.error("Error confirmando pago:", error);
            toast.error("Error al procesar la confirmación del pago.");
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
                    toast.error("Hubo un problema con la plataforma de pago.");
                    console.error("PayPal SDK Error:", err);
                }}
            />
        </PayPalScriptProvider>
    );
}
