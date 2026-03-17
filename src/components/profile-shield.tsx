"use client";

import Image from "next/image";
import { Collaborator } from "@/types/collaborator";

const SHIELD_BASE = "https://firebasestorage.googleapis.com/v0/b/studio-7857394445-e1558.firebasestorage.app/o/escudos%2F";

const SHIELD_MAP: Record<number, { file: string; token: string }> = {
  1: { file: "Image1%202026-03-16%20at%201.59.19%20AM.png", token: "d8f4e7eb-84bf-40d9-aabb-9652254127e6" },
  2: { file: "Image2%202026-03-16%20at%201.59.19%20AM%20(1).png", token: "0e3a6938-1493-4774-870d-6b27d35b5e6d" },
  3: { file: "Image3%202026-03-16%20at%201.59.19%20AM%20(2).png", token: "370a3897-5c53-4c55-8314-5b03178cc593" },
  4: { file: "Image4%202026-03-16%20at%201.59.19%20AM%20(3).png", token: "e4a02e70-13e1-4aa4-8dd2-8982cda820be" },
  5: { file: "Image5%202026-03-16%20at%201.59.20%20AM.png", token: "5d9ae057-f3a6-4dfa-9290-afb6af90fba5" },
  6: { file: "Image6%202026-03-16%20at%201.59.20%20AM%20(1).png", token: "7517405c-bee6-4c00-9b8e-56413a6c4fe9" },
  7: { file: "Image7%202026-03-16%20at%201.59.20%20AM%20(2).png", token: "3098bc73-2dc0-4e12-ac8e-179999b786de" },
  8: { file: "Image8%202026-03-16%20at%201.59.20%20AM%20(3).png", token: "c619a96c-f5b5-41f7-a3ca-72ca47eae6e1" },
  9: { file: "image9%202026-03-16%20at%201.59.20%20AM%20(4).png", token: "920c9f13-352a-41fb-8f89-cb34875f53c2" },
  10: { file: "Image10%202026-03-16%20at%201.59.21%20AM.png", token: "8eead3f5-bfe8-46ab-8511-cb3d317afdc2" },
};

interface ProfileShieldProps {
  collaborator: Collaborator;
  size?: number;
  className?: string;
}

export function ProfileShield({ collaborator, size = 48, className = "" }: ProfileShieldProps) {
  const followers = collaborator.seguidoresCount || 0;
  const comments = collaborator.comentariosCount || 0;
  const stars = collaborator.estrellas || 0;

  // Lógica exigente: si todo es 0, NO se muestra nada
  if (followers === 0 && comments === 0 && stars === 0) return null;

  const prestigeScore = (followers * 2) + (comments * 0.5) + (stars * 10);

  let level = 1;
  if (prestigeScore > 250) level = 10;
  else if (prestigeScore > 200) level = 9;
  else if (prestigeScore > 150) level = 8;
  else if (prestigeScore > 100) level = 7;
  else if (prestigeScore > 75) level = 6;
  else if (prestigeScore > 50) level = 5;
  else if (prestigeScore > 30) level = 4;
  else if (prestigeScore > 15) level = 3;
  else if (prestigeScore > 5) level = 2;
  else level = 1;

  const shield = SHIELD_MAP[level];
  const imageUrl = `${SHIELD_BASE}${shield.file}?alt=media&token=${shield.token}`;

  return (
    <div 
      className={`relative z-30 pointer-events-none flex items-center justify-center bg-transparent border-0 outline-none shadow-none ring-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageUrl}
        alt={`Nivel ${level}`}
        width={size}
        height={size}
        className="object-contain bg-transparent border-0 outline-none shadow-none"
        unoptimized
      />
    </div>
  );
}
