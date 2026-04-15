
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin-connection";

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();
    
    const CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const SECRET = process.env.PAYPAL_SECRET;

    const auth = Buffer.from(CLIENT + ":" + SECRET).toString("base64");

    // 1. Obtener Token
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Capturar Orden
    const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await captureRes.json();

    // 3. Si el pago fue exitoso, verificar al usuario en Firestore
    if (captureData.status === "COMPLETED") {
      const purchaseUnit = captureData.purchase_units[0];
      const userId = purchaseUnit.payments.captures[0].custom_id;

      if (userId) {
        const batch = adminDb.batch();
        const userRef = adminDb.collection("usuarios").doc(userId);
        const colabRef = adminDb.collection("colaboradores").doc(userId);

        batch.update(userRef, { verificado: true });
        
        const colabSnap = await colabRef.get();
        if (colabSnap.exists) {
          batch.update(colabRef, { verificado: true });
        }

        await batch.commit();
        console.log(`Usuario ${userId} verificado vía Capture Order.`);
      }
    }

    return NextResponse.json(captureData);
  } catch (error: any) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
