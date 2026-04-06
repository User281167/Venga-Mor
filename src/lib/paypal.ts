import {
  Client,
  Environment,
  OrdersController,
} from "@paypal/paypal-server-sdk";

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.Production
      : Environment.Sandbox,
});

export const ordersController = new OrdersController(client);
