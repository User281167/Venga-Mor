import { ordersController } from "@/lib/paypal";
import { ApiResponse } from "@/lib/api-response";
import { getUserID } from "@/app/api/utils";
import { adminDb } from "@/lib/firebase-admin-connection";
import { getJewelryQuantityByPrice } from "@/lib/jewelry";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderID: string }> },
) {
  const uid = await getUserID();
  if (!uid) {
    return new Response(
      ApiResponse.failure("Usuario no autenticado").toJSON(),
      { status: 401 },
    );
  }

  const { orderID } = await params;

  if (!orderID) {
    return new Response(
      ApiResponse.failure("orderID no proporcionado").toJSON(),
      {
        status: 404,
      },
    );
  }

  try {
    const response = await ordersController.captureOrder({
      id: orderID,
      prefer: "return=representation",
    });

    if (response.statusCode !== 201 || response.result.status !== "COMPLETED") {
      return new Response(ApiResponse.failure("Pago no completado.").toJSON(), {
        status: 400,
      });
    }

    const capture = response.result.purchaseUnits?.[0]?.payments?.captures?.[0];
    const userId = response.result.purchaseUnits?.[0]?.customId;
    const amountValue =
      response.result.purchaseUnits?.[0]?.amount?.value ??
      capture?.amount?.value;
    const quantity = getJewelryQuantityByPrice(amountValue ?? "");

    if (uid !== userId) {
      return new Response(
        ApiResponse.failure(
          "La captura no pertenece al usuario autenticado",
        ).toJSON(),
        {
          status: 403,
        },
      );
    }

    if (!capture || capture.status !== "COMPLETED") {
      return new Response(ApiResponse.failure("Captura invalida").toJSON(), {
        status: 400,
      });
    }

    if (!quantity) {
      return new Response(
        ApiResponse.failure("Monto de joyas invalido.").toJSON(),
        {
          status: 400,
        },
      );
    }

    await adminDb.runTransaction(async (transaction) => {
      const jewelryRef = adminDb.collection("userJewelry").doc(uid);
      const jewelrySnap = await transaction.get(jewelryRef);
      const currentQuantity = Number(jewelrySnap.data()?.quantity ?? 0);

      transaction.set(
        jewelryRef,
        { quantity: currentQuantity + quantity },
        { merge: true },
      );
    });

    return new Response(
      ApiResponse.success(
        { quantityAdded: quantity },
        "Joyas agregadas.",
      ).toJSON(),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error capturando pago:", error);

    return new Response(
      ApiResponse.failure("Error al capturar el pago.").toJSON(),
      { status: 500 },
    );
  }
}
