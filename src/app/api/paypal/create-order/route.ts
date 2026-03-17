import { NextResponse } from "next/server";

/**
 * API para crear una orden de PayPal desde el servidor.
 * Esto protege las credenciales y asegura que el ID de la orden sea válido.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    // Credenciales oficiales proporcionadas por el usuario
    const CLIENT = "ASWoUY2hASGLV457PLVjFP-GpQHdyFUQjfs07h7NnzvuAeMRUiz2GOa_347qPhsvKqAJk9U-ukrRXG_6";
    const SECRET = process.env.PAYPAL_SECRET || "ENPCkFzau8A0j4TV51UfP5Shb3i3LU247Myr9m5udpNyI-truW4OvOqgsgtI3PDMU0UodPMKOYShdjMU";

    if (!CLIENT || !SECRET) {
      return NextResponse.json({ error: "PayPal credentials missing in server" }, { status: 500 });
    }

    const auth = Buffer.from(CLIENT + ":" + SECRET).toString("base64");

    // 1. Obtener Access Token (Producción)
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    
    if (!tokenData.access_token) {
      console.error("Fallo al obtener token de PayPal:", tokenData);
      return NextResponse.json({ error: "Failed to authenticate with PayPal" }, { status: 500 });
    }

    const accessToken = tokenData.access_token;

    // 2. Crear Orden con custom_id para identificar al colaborador
    const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "5.00",
            },
            custom_id: userId, // Vínculo directo con el UID del colaborador
            description: "Verificación Oficial Venga Mor"
          },
        ],
      }),
    });

    const orderData = await orderRes.json();
    
    console.log("🧾 ORDEN CREADA EN SERVIDOR:", orderData.id);
    
    // Retornamos el objeto completo de la orden para que el frontend extraiga el .id
    return NextResponse.json(orderData);
  } catch (error: any) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
