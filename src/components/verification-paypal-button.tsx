"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ENV } from "@/lib/env";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  captureVerifyProfilePaypal,
  createVerifyProfilePaypal,
} from "@/handlers/verifyProfilePaypal";

interface Props {
  setSuccess: (value: boolean) => void;
}

export default function VerificationPayPalButton({ setSuccess }: Props) {
  const router = useRouter();

  const createOrder = async () => {
    const res = await createVerifyProfilePaypal();

    if (!res.success || !res.data) {
      toast.error("Hubo un problema al crear la orden. Intenta de nuevo.");
      throw new Error("Failed to create order");
    }

    return res.data.orderID;
  };

  const onApprove = async (data: any, actions: any) => {
    const res = await captureVerifyProfilePaypal(data.orderID);

    if (!res.success) {
      toast.error("Hubo un problema al capturar la orden. Intenta de nuevo.");
      return;
    }

    toast.success("¡Pago aprobado! Tu perfil se activará en unos segundos.");
    setSuccess(true);
    // router.push(`/confirmacion`);
  };

  const onError = (err: any) => {
    toast.error("Hubo un problema con la transacción. Intenta de nuevo.");
    console.error("PayPal Error:", err);
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: ENV.PAYPAL_CLIENT_ID || "test",
        intent: "capture",
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay",
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
}
