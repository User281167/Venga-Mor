import { adminDb } from "@/lib/firebase-admin-connection";
import { headers } from 'next/headers';
import { NextResponse } from "next/server";

// This is a simplified webhook handler.
// In a production environment, you MUST verify the webhook signature.
// https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
// This requires fetching PayPal's certs and using crypto libraries.

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // LOGGING for debugging purposes
        console.log("PayPal Webhook Event Received:", JSON.stringify(body, null, 2));

        // You should verify the webhook signature here for security
        // For this prototype, we'll proceed without verification.

        if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
            const order = body.resource;
            const purchase_units = order.purchase_units;

            if (purchase_units && purchase_units.length > 0) {
                const customId = purchase_units[0].custom_id;

                if (!customId) {
                    console.error("Webhook Error: custom_id (userId) is missing.");
                    return NextResponse.json({ error: 'Missing custom_id' }, { status: 400 });
                }

                const userId = customId;

                console.log(`Processing verification for user: ${userId}`);

                // Update user in Firestore
                const userRef = adminDb.collection("usuarios").doc(userId);
                const collaboratorRef = adminDb.collection("colaboradores").doc(userId);

                const userDoc = await userRef.get();

                const batch = adminDb.batch();

                batch.update(userRef, { verificado: true });

                // Also update collaborator document if it exists
                const collaboratorDoc = await collaboratorRef.get();
                if (collaboratorDoc.exists) {
                     batch.update(collaboratorRef, { verificado: true });
                }
                
                await batch.commit();

                console.log(`User ${userId} successfully verified.`);
            }
        }

        return NextResponse.json({ status: 'success' }, { status: 200 });

    } catch (error: any) {
        console.error("Webhook processing error:", error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
