import { adminDb } from "@/lib/firebase-admin-connection";
import { NextResponse } from "next/server";

/**
 * WEBHOOK OFICIAL DE PAYPAL
 * Este endpoint recibe las notificaciones de pago y actualiza el estado de verificación.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // LOGGING para auditoría
        console.log("PayPal Webhook Recibido:", body.event_type);

        // Verificamos que el evento sea una orden capturada/aprobada
        if (body.event_type === 'CHECKOUT.ORDER.APPROVED' || body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            const resource = body.resource;
            // El custom_id puede venir en purchase_units o en el resource directamente
            const purchase_units = resource.purchase_units || (resource.amount ? [resource] : []);
            
            let userId = null;
            if (purchase_units && purchase_units.length > 0) {
                userId = purchase_units[0].custom_id || resource.custom_id;
            } else {
                userId = resource.custom_id;
            }

            if (!userId) {
                console.error("Error Webhook: userId (custom_id) no encontrado en el cuerpo del mensaje.");
                return NextResponse.json({ error: 'Missing custom_id' }, { status: 200 }); // Retornamos 200 para que PayPal no reintente
            }

            console.log(`Verificando automáticamente al usuario: ${userId}`);

            const batch = adminDb.batch();
            const userRef = adminDb.collection("usuarios").doc(userId);
            const collaboratorRef = adminDb.collection("colaboradores").doc(userId);

            // Actualizar ambos documentos
            batch.update(userRef, { verificado: true });
            
            const collaboratorDoc = await collaboratorRef.get();
            if (collaboratorDoc.exists) {
                 batch.update(collaboratorRef, { verificado: true });
            }
            
            await batch.commit();
            console.log(`Usuario ${userId} verificado con éxito.`);
        }

        return NextResponse.json({ status: 'success' }, { status: 200 });

    } catch (error: any) {
        console.error("Error procesando Webhook de PayPal:", error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}