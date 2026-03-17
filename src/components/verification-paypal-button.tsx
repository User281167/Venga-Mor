"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  userId: string;
}

export default function VerificationPayPalButton({ userId }: Props) {
  const router = useRouter();

  // Credenciales oficiales proporcionadas por el usuario
  const clientId = "Ab_0iZLzoYn4A2tVkVV_FR2_Bs7-QgMsYOuoxCZGhW-Z2GvzdTNJlvq_aAR-ajpMRqDtPXYrRVrWS5MA";
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
            custom_id: userId // Vínculo crítico para la verificación automática
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
