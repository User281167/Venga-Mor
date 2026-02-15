"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ENV } from "@/lib/env";

export default function PayPalPayment({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <PayPalScriptProvider
        options={{
          clientId: "test",
          vault: true,
          intent: "subscription",
        }}
      >
        <PayPalButtons
          style={{
            shape: "rect",
            color: "gold",
            layout: "vertical",
            label: "subscribe",
          }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: ENV.PAYPAL_PLAN_ID,
            });
          }}
          onApprove={(data, actions) => {
            alert(`Subscription successful: ${data.subscriptionID}`);
            // You can add optional success message for the subscriber here
            // Or redirect to a success page
            return Promise.resolve();
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
