'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingClipsButton() {
  const pathname = usePathname();

  const noNavRoutes = ['/iniciar-sesion', '/registrarse', '/restablecer-cuenta', '/'];
  if (noNavRoutes.includes(pathname)) {
    return null;
  }

  return (
    <Link 
        href="/clips"
        className={cn(
            "fixed bottom-20 right-4 z-40 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-110 active:scale-100",
        )}
        aria-label="Ver Clips"
    >
      <Clapperboard className="h-8 w-8" />
    </Link>
  );
}
