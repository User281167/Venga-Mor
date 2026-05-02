"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ENV } from "@/lib/env";
import { toast } from "sonner";
import {
  captureJewelryPaypal,
  createJewelryPaypal,
} from "@/handlers/jewelryPaypal";

interface Props {
  quantity: number;
  onSuccess: (addedQuantity: number) => void;
}

export default function JewelryPayPalButton({ onSuccess, quantity }: Props) {
  const createOrder = async () => {
    const res = await createJewelryPaypal(quantity);

    if (!res.success || !res.data) {
      toast.error("Hubo un problema al crear la orden. Intenta de nuevo.");
      throw new Error("Failed to create order");
    }

    return res.data.orderID;
  };

  const onApprove = async (data: any) => {
    const res = await captureJewelryPaypal(data.orderID);

    if (!res.success) {
      toast.error("Hubo un problema al capturar la orden. Intenta de nuevo.");
      return;
    }

    const quantityAdded =
      (res.data as { quantityAdded?: number } | undefined)?.quantityAdded ??
      quantity;

    toast.success("Pago aprobado. Joyas agregadas.");
    onSuccess(quantityAdded);
  };

  const onError = (err: any) => {
    toast.error("Hubo un problema con la transaccion. Intenta de nuevo.");
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
