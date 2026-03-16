"use client";

import Image from "next/image";
import { Collaborator } from "@/types/collaborator";

// Base URL para los escudos en Firebase Storage
const SHIELD_BASE_URL = "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/escudos%2F";

interface ProfileShieldProps {
  collaborator: Collaborator;
  size?: number;
  className?: string;
}

export function ProfileShield({ collaborator, size = 48, className = "" }: ProfileShieldProps) {
  const followers = collaborator.seguidoresCount || 0;
  const comments = collaborator.comentariosCount || 0;
  const stars = collaborator.estrellas || 0;

  // Lógica para determinar qué escudo mostrar (1, 2, 3 en el orden de la carpeta)
  // Puedes ajustar estos rangos según lo que consideres "cotizado"
  let shieldId = "";

  if (followers > 50 || (stars >= 4.8 && comments > 20)) {
    shieldId = "1.png"; // El más top (Oro/Diamante)
  } else if (followers > 20 || stars >= 4.5) {
    shieldId = "2.png"; // Nivel medio (Plata)
  } else if (followers > 5 || comments > 5) {
    shieldId = "3.png"; // Nivel inicial (Bronce)
  }

  if (!shieldId) return null;

  // URL con el token de media para visualización directa
  const imageUrl = `${SHIELD_BASE_URL}${shieldId}?alt=media`;

  return (
    <div 
      className={`relative z-30 pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageUrl}
        alt="Escudo de Rango"
        width={size}
        height={size}
        className="object-contain"
        unoptimized
      />
    </div>
  );
}
