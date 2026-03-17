import { NextResponse } from "next/server";

/**
 * API para crear una orden de PayPal desde el servidor con logs detallados.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    console.log("🔥 INICIO create-order para usuario:", userId);

    // Credenciales oficiales proporcionadas
    const CLIENT = "ASWoUY2hASGLV457PLVjFP-GpQHdyFUQjfs07h7NnzvuAeMRUiz2GOa_347qPhsvKqAJk9U-ukrRXG_6";
    const SECRET = process.env.PAYPAL_SECRET || "ENPCkFzau8A0j4TV51UfP5Shb3i3LU247Myr9m5udpNyI-truW4OvOqgsgtI3PDMU0UodPMKOYShdjMU";

    const auth = Buffer.from(CLIENT + ":" + SECRET).toString("base64");

    // 1. Obtener Access Token
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    console.log("🔑 TOKEN:", tokenData);

    if (!tokenData.access_token) {
      return NextResponse.json({ error: "Fallo al obtener token" }, { status: 500 });
    }

    // 2. Crear Orden
    const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
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
            custom_id: userId, // Vínculo para el webhook y verificación
            description: "Verificación Oficial Venga Mor"
          },
        ],
      }),
    });

    const orderData = await orderRes.json();
    console.log("🧾 ORDEN:", orderData);

    return NextResponse.json(orderData);
  } catch (error: any) {
    console.error("❌ ERROR TOTAL:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
