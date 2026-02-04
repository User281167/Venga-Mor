'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button, Flex, Popover, Text, Separator, Slider } from '@radix-ui/themes';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/theme-context';
import { toast } from 'sonner';

const messages = [
    "Mor, modelos únicas.",
    "Mor, cada modelo pone sus restricciones.",
    "Mor, una app para calentarte.",
    "Mor, cada colaborador, un mundo distinto.",
    "Mor, no acoses, trata con respeto.",
    "Mor, trata a los demás como te gustaría que te traten.",
    "Mor, trata con amor a nuestras chicas.",
    "Mor, recuerda que esta app maneja seguridad de extremo a extremo.",
    "Mor, los acompañantes de servicio tienen su margen de precio individual.",
    "Mor, ofrecemos servicios como: charlas, citas, videollamadas, contenido y chats abiertos.",
    "Mor, recuerda que también hay servicios sin fin sexual.",
    "Mor, busca tu match.",
    "Mor, ábrete al amor.",
    "Mor, encuentra scorkl.",
    "Mor, miles de servicios en Venga Mor.",
    "Mor, vive cada segundo en Venga Mor.",
];

const themeColors = [
    { name: 'Venga Mor', value: '337 85% 55%' },
    { name: 'Cian Neón', value: '180 85% 50%' },
    { name: 'Violeta Eléctrico', value: '270 90% 65%' },
    { name: 'Lima Caliente', value: '75 90% 50%' },
]

export function FloatingMascot() {
    const pathname = usePathname();
    const mascotImage = PlaceHolderImages.find(p => p.id === 'floating-mascot');
    const [currentMessage, setCurrentMessage] = useState(messages[0]);
    const [isVisible, setIsVisible] = useState(false);

    const { 
        setExploreBackground, 
        resetExploreBackground,
        setPrimaryColor,
        bgOpacity,
        setBgOpacity,
    } = useTheme();

    const noMascotRoutes = ['/iniciar-sesion', '/registrarse', '/restablecer-cuenta', '/'];
    const shouldShowMascot = !noMascotRoutes.includes(pathname);
    const isExplorePage = pathname.startsWith('/perfiles');

    useEffect(() => {
        if (shouldShowMascot) {
            const initialTimeout = setTimeout(() => {
                setIsVisible(true);
            }, 2000);

            const interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * messages.length);
                setCurrentMessage("Mor, " + messages[randomIndex].replace(/^Mor, /, ''));
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

    const handleSetBackground = () => {
        setExploreBackground(mascotImage.imageUrl);
        toast.success("Fondo de pantalla actualizado!");
    };
    
    const handleResetBackground = () => {
        resetExploreBackground();
        toast.info("Fondo de pantalla restablecido.");
    };

    return (
        <div className="fixed top-24 left-4 z-[100] w-auto max-w-xs">
             <Popover.Root>
                <Popover.Trigger>
                    <motion.div
                        className="flex items-center gap-3 justify-start cursor-pointer"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                    >
                        {/* Mascot Image */}
                        <Image
                            src={mascotImage.imageUrl}
                            alt={mascotImage.description}
                            width={64}
                            height={64}
                            className="rounded-full border-2 border-primary object-cover shadow-lg"
                        />
                        {/* Animated Text */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentMessage}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.5 }}
                                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                            >
                                <Text as="p" size="2" weight="bold" className="text-white italic text-left">
                                "{currentMessage}"
                                </Text>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </Popover.Trigger>
                 <Popover.Content>
                    <Flex direction="column" gap="3">
                        <Text size="2" weight="bold">Estabilizador de Experiencia</Text>
                        
                        <Separator />

                        <Text size="1" weight="bold" color='gray'>Color del Tema</Text>
                        <Flex gap="2" wrap="wrap">
                            {themeColors.map(color => (
                                <Button key={color.name} size="1" variant='soft' onClick={() => setPrimaryColor(color.value)}>
                                    {color.name}
                                </Button>
                            ))}
                        </Flex>

                        <Separator />
                        
                        <Text size="1" weight="bold" color='gray'>Brillo del Fondo</Text>
                        <Slider 
                            value={[bgOpacity]} 
                            onValueChange={(value) => setBgOpacity(value[0])}
                            min={0}
                            max={100}
                            step={5}
                        />

                        <Separator />
                        
                        {isExplorePage && (
                            <>
                                <Button variant="soft" onClick={handleSetBackground}>Poner de fondo</Button>
                                <Button variant="soft" color="gray" onClick={handleResetBackground}>Restablecer fondo</Button>
                            </>
                        )}
                        <Text size="1" color="gray">Modo Inmersivo (OLED) está activo.</Text>
                    </Flex>
                </Popover.Content>
            </Popover.Root>
        </div>
    );
}
