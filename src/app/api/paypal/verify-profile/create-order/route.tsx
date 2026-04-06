import { ordersController } from "@/lib/paypal";
import { CheckoutPaymentIntent } from "@paypal/paypal-server-sdk";
import { ApiResponse } from "@/lib/api-response";
import { getUserID } from "@/app/api/utils";
import { PaypalOrderDto } from "@/dtos/paypalOder.dto";

export async function POST() {
  const uid = await getUserID();

  if (!uid) {
    return new Response(
      ApiResponse.failure("Usuario no autenticado").toJSON(),
      { status: 401 },
    );
  }

  try {
    const response = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            description: "Verificación de Perfil Oficial - Venga Mor",
            customId: uid,
            amount: {
              currencyCode: "USD",
              value: "5.00",
            },
          },
        ],
      },
      prefer: "return=minimal",
    });

    if (response.result.status !== "CREATED" || !response.result.id) {
      return new Response(
        ApiResponse.failure(
          "Error al crear medio de pago, intentalo de nuevo más tarde.",
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
        "Error al crear medio de pago, intentalo de nuevo más tarde.",
      ).toJSON(),
      { status: 500 },
    );
  }
}
