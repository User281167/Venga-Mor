'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, Text } from '@radix-ui/themes';
import { AnimatePresence, motion } from 'framer-motion';

const messages = [
    "Modelos únicas.",
    "Cada modelo pone sus restricciones.",
    "Una app para calentarte.",
    "Cada colaborador, un mundo distinto.",
    "No acoses, trata con respeto.",
    "Trata a los demás como te gustaría que te traten.",
    "Trata con amor a nuestras chicas.",
    "Recuerda que esta app maneja seguridad de extremo a extremo.",
    "Acompañantes de servicio tienen su margen de precio individual.",
    "Servicios: charlas, citas, videollamadas, contenido, chat abiertos.",
    "Recuerda que también hay servicios sin fin sexual.",
    "Busca tu match.",
    "Ábrete al amor.",
    "Encuentra scorkl.",
    "Miles de servicios en Venga Mor.",
    "Vive cada segundo en Venga Mor.",
];

export function FloatingMascot() {
    const mascotImage = PlaceHolderImages.find(p => p.id === 'floating-mascot');
    const [currentMessage, setCurrentMessage] = useState(messages[0]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a delay
        const initialTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        // Change message every 8 seconds
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * messages.length);
            setCurrentMessage(messages[randomIndex]);
        }, 8000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    if (!mascotImage || !isVisible) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-[100] w-64 hidden md:block">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="bg-card/80 backdrop-blur-sm relative shadow-lg">
                     <div className="absolute -top-8 -left-8 w-20 h-20">
                         <Image
                            src={mascotImage.imageUrl}
                            alt={mascotImage.description}
                            width={80}
                            height={80}
                            className="rounded-full border-2 border-primary object-cover"
                         />
                    </div>
                    <AnimatePresence mode="wait">
                         <motion.div
                            key={currentMessage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="pl-10 min-h-[50px] flex items-center"
                        >
                            <Text as="p" size="2" className="text-white/90 italic">
                                "{currentMessage}"
                            </Text>
                        </motion.div>
                    </AnimatePresence>
                </Card>
            </motion.div>
        </div>
    );
}
