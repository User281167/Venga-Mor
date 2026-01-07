
'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle2 } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Link from 'next/link';


export default function SuscripcionPage() {
    const subscriptionBg = PlaceHolderImages.find(p => p.id === 'subscription-bg');
    const PAYPAL_PLAN_ID = 'P-72083711K7639872BNE52YSQ';
    const PAYPAL_CLIENT_ID = 'ASWoUY2hASGLV457PLVjFP-GpQHdyFUQjfs07h7NnzvuAeMRUiz2GOa_347qPhsvKqAJk9U-ukrRXG_6';

    const benefits = [
        "Perfiles ilimitados",
        "Chatea sin restricciones",
        "Fotos y videos exclusivos",
        "Filtros de búsqueda avanzados",
        "Modo incógnito",
    ];

  return (
    <div className="relative min-h-screen -m-8 -mb-24 flex items-center justify-center overflow-hidden">
        {subscriptionBg && (
             <Image
                src={subscriptionBg.imageUrl}
                alt="Suscripción Venga Mor"
                layout="fill"
                objectFit="cover"
                unoptimized
                className="absolute z-0"
                data-ai-hint={subscriptionBg.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 flex flex-col items-center text-center text-white p-4 w-full">
            <h1 className="text-5xl font-bold text-primary mb-4" style={{ fontFamily: "'Playball', cursive" }}>Suscripción Premium</h1>
            
            <Card className="w-full max-w-md bg-card/80 border-primary shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl text-yellow-400">
                        <Crown className="h-8 w-8" />
                        <span>Membresía Premium</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <ul className="space-y-3 text-left mb-6">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center">
                                <CheckCircle2 className="h-5 w-5 text-accent mr-3" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="space-y-4">
                        <PayPalScriptProvider
                            options={{
                                "clientId": PAYPAL_CLIENT_ID,
                                "vault": true,
                                "intent": "subscription",
                            }}
                        >
                            <PayPalButtons
                                style={{
                                    shape: 'rect',
                                    color: 'gold',
                                    layout: 'vertical',
                                    label: 'subscribe'
                                }}
                                createSubscription={(data, actions) => {
                                    return actions.subscription.create({
                                        plan_id: PAYPAL_PLAN_ID
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    alert(`Subscription successful: ${data.subscriptionID}`);
                                    return Promise.resolve();
                                }}
                            />
                        </PayPalScriptProvider>
                        
                        <Link href="https://mpago.li/2Z9He9g" target="_blank" rel="noopener noreferrer" className='w-full'>
                            <Button variant="outline" className="w-full bg-sky-500 hover:bg-sky-600 text-white text-lg py-6">
                                Pagar con Mercado Pago
                            </Button>
                        </Link>

                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
