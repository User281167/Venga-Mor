"use client";
import { Flex, Heading } from "@radix-ui/themes";
import { Facebook, Instagram, Youtube, Twitter, Globe } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ProfileSocialsProps {
  redes: string[];
}

const SocialIcon = ({ url }: { url: string }) => {
  let icon = <Globe size={24} />;
  if (url.includes("youtube.com")) {
    icon = <Youtube size={24} />;
  } else if (url.includes("instagram.com")) {
    icon = <Instagram size={24} />;
  } else if (url.includes("facebook.com")) {
    icon = <Facebook size={24} />;
  } else if (url.includes("twitter.com") || url.includes("x.com")) {
    icon = <Twitter size={24} />;
  } else if (url.includes("tiktok.com")) {
    icon = (
      <img
        src="/tiktok-icon.png"
        alt="TikTok"
        width={24}
        height={24}
        className="bg-white/50 rounded-lg hover:bg-red-500/60 transition-colors"
      />
    );
  } else if (url.includes("whatsapp.com") || url.includes("wa.me")) {
    icon = (
      <img src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} />
    );
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-primary transition-colors"
    >
      {icon}
    </Link>
  );
};

export default function ProfileSocials({ redes }: ProfileSocialsProps) {
  if (!redes || redes.length === 0) {
    return null;
  }

  return (
    <Flex direction="column" gap="2">
      <Heading as="h2" size="4">
        Redes Sociales
      </Heading>
      <Flex gap="4" align="center">
        {redes.map((url, index) => (
          <SocialIcon key={index} url={url} />
        ))}
      </Flex>
    </Flex>
  );
}
