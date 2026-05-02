import { ordersController } from "@/lib/paypal";
import { CheckoutPaymentIntent } from "@paypal/paypal-server-sdk";
import { ApiResponse } from "@/lib/api-response";
import { getUserID } from "@/app/api/utils";
import { PaypalOrderDto } from "@/dtos/paypalOder.dto";
import { getJewelryPackageByQuantity } from "@/lib/jewelry";

export async function POST(req: Request) {
  const uid = await getUserID();

  if (!uid) {
    return new Response(
      ApiResponse.failure("Usuario no autenticado").toJSON(),
      { status: 401 },
    );
  }

  try {
    const body = (await req.json().catch(() => ({}))) as {
      quantity?: number;
    };
    const quantity = Number(body.quantity ?? 10);
    const jewelryPackage = getJewelryPackageByQuantity(quantity);

    if (!jewelryPackage) {
      return new Response(
        ApiResponse.failure(
          "Paquete de joyas invalido. Usa 10, 50, 120 o 250.",
        ).toJSON(),
        { status: 400 },
      );
    }

    const response = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            description: `${jewelryPackage.quantity} joyas - Venga Mor`,
            customId: uid,
            amount: {
              currencyCode: "USD",
              value: jewelryPackage.price.toFixed(2),
            },
          },
        ],
      },
      prefer: "return=minimal",
    });

    if (response.result.status !== "CREATED" || !response.result.id) {
      return new Response(
        ApiResponse.failure(
          "Error al crear medio de pago, intentalo de nuevo mas tarde.",
        ).toJSON(),
        {
          status: 400,
        },
      );
    }

    const dto: PaypalOrderDto = {
      orderID: response.result.id,
    };

    return new Response(
      ApiResponse.success(dto, "Medio de pago creado exitosamente").toJSON(),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error creando orden PayPal:", error);

    return new Response(
      ApiResponse.failure(
        "Error al crear medio de pago, intentalo de nuevo mas tarde.",
      ).toJSON(),
      { status: 500 },
    );
  }
}
