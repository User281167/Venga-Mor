"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  userId: string;
}

export default function VerificationPayPalButton({ userId }: Props) {
  const router = useRouter();

  const clientId = "ASWoUY2hASGLV457PLVjFP-GpQHdyFUQjfs07h7NnzvuAeMRUiz2GOa_347qPhsvKqAJk9U-ukrRXG_6";
  const planId = "P-1NL369384W076884CNG4HDUQ";

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId,
        vault: true,
        intent: "subscription",
        currency: "USD"
      }}
    >
      <PayPalButtons
        style={{ 
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "subscribe"
        }}

        createSubscription={(data, actions) => {
          return actions.subscription.create({
            plan_id: planId,
            custom_id: userId // Vinculamos el pago al ID del colaborador
          });
        }}

        onApprove={async (data) => {
          console.log("🔥 SUSCRIPCIÓN ACTIVADA:", data);
          toast.success("¡Suscripción activada con éxito!");
          router.push("/confirmacion");
        }}

        onError={(err) => {
          console.error("❌ Error PayPal:", err);
          toast.error("Hubo un problema con la suscripción. Intenta de nuevo.");
        }}
      />
    </PayPalScriptProvider>
  );
}
