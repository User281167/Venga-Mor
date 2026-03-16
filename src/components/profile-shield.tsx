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

  // Calculamos un puntaje de prestigio para determinar el escudo (1 al 10)
  // Jewel/Joyas se sumaría aquí si estuviera en el modelo, por ahora usamos actividad
  const prestigeScore = (followers * 2) + (comments) + (stars * 5);

  let shieldFile = "";

  // Mapeo de escudos según prestigio (del 1 al 10)
  if (prestigeScore > 200) shieldFile = "Image10%202026-03-16%20at%201.59.21%20AM.png";
  else if (prestigeScore > 150) shieldFile = "image9%202026-03-16%20at%201.59.20%20AM%20%284%29.png";
  else if (prestigeScore > 120) shieldFile = "Image8%202026-03-16%20at%201.59.20%20AM%20%283%29.png";
  else if (prestigeScore > 100) shieldFile = "Image7%202026-03-16%20at%201.59.20%20AM%20%282%29.png";
  else if (prestigeScore > 80) shieldFile = "Image6%202026-03-16%20at%201.59.20%20AM%20%281%29.png";
  else if (prestigeScore > 60) shieldFile = "Image5%202026-03-16%20at%201.59.20%20AM.png";
  else if (prestigeScore > 40) shieldFile = "Image4%202026-03-16%20at%201.59.19%20AM%20%283%29.png";
  else if (prestigeScore > 20) shieldFile = "Image3%202026-03-16%20at%201.59.19%20AM%20%282%29.png";
  else if (prestigeScore > 10) shieldFile = "Image2%202026-03-16%20at%201.59.19%20AM%20%281%29.png";
  else shieldFile = "Image1%202026-03-16%20at%201.59.19%20AM.png";

  const imageUrl = `${SHIELD_BASE_URL}${shieldFile}?alt=media`;

  return (
    <div 
      className={`relative z-30 pointer-events-none drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-all duration-500 hover:scale-110 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageUrl}
        alt="Escudo de Rango Venga Mor"
        width={size}
        height={size}
        className="object-contain"
        unoptimized
      />
    </div>
  );
}
