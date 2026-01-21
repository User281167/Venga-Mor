"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, MessageSquare, User, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/perfiles', label: 'Explorar', icon: Compass },
  { href: '/chats', label: 'Chats', icon: MessageSquare },
  { href: '/perfil', label: 'Perfil', icon: User },
  { href: '/info', label: 'Info', icon: Info },
];

export function BottomNav() {
  const pathname = usePathname();

  const noNavRoutes = ['/iniciar-sesion', '/registrarse', '/restablecer-cuenta', '/'];
  if (noNavRoutes.includes(pathname)) {
    return null;
  }


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 shadow-t-lg z-50 h-16">
      <div className="container mx-auto flex justify-around max-w-md h-full">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link href={item.href} key={item.href} className={cn(
                "flex flex-col items-center justify-center w-full pt-1 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}>
              <item.icon className="h-6 w-6 mb-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
