'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Text } from '@radix-ui/themes';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

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
    const pathname = usePathname();
    const mascotImage = PlaceHolderImages.find(p => p.id === 'floating-mascot');
    const [currentMessage, setCurrentMessage] = useState(messages[0]);
    const [isVisible, setIsVisible] = useState(false);

    const noMascotRoutes = ['/iniciar-sesion', '/registrarse', '/restablecer-cuenta', '/'];
    const shouldShowMascot = !noMascotRoutes.includes(pathname);

    useEffect(() => {
        if (shouldShowMascot) {
            const initialTimeout = setTimeout(() => {
                setIsVisible(true);
            }, 2000);

            const interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * messages.length);
                setCurrentMessage(messages[randomIndex]);
            }, 8000);

            return () => {
                clearTimeout(initialTimeout);
                clearInterval(interval);
            };
        } else {
            setIsVisible(false);
        }
    }, [shouldShowMascot]);

    if (!mascotImage || !isVisible) {
        return null;
    }

    return (
        <div className="fixed top-24 right-4 z-[100] w-auto max-w-xs hidden md:block">
            <motion.div
                 className="flex items-center gap-3 justify-end"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                {/* Animated Text */}
                <AnimatePresence mode="wait">
                     <motion.div
                        key={currentMessage}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.5 }}
                        style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                    >
                        <Text as="p" size="2" weight="bold" className="text-white italic text-right">
                           "{currentMessage}"
                        </Text>
                    </motion.div>
                </AnimatePresence>

                {/* Mascot Image */}
                 <Image
                    src={mascotImage.imageUrl}
                    alt={mascotImage.description}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-primary object-cover shadow-lg"
                 />
            </motion.div>
        </div>
    );
}
