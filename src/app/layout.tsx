import { Poppins, Playball } from "next/font/google";
import { Toaster } from "sonner";

import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import { FloatingClipsButton } from "@/components/floating-clips-button";
import { BottomNav } from "@/components/bottom-nav";
import { FloatingMascot } from "@/components/floating-mascot";
import { Metadata, Viewport } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const playball = Playball({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-playball",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Venga Mor",
  description: "Tu compañía de élite en Bogotá.",
  icons: {
    icon: "https://i.ibb.co/XZ1jGh0x/In-Shot-20231119-124433570.jpg",
    apple: "https://i.ibb.co/XZ1jGh0x/In-Shot-20231119-124433570.jpg",
  },
  openGraph: {
    title: "Venga Mor",
    description: "Tu compañía de élite en Bogotá.",
    images: [
      {
        url: "https://i.ibb.co/XZ1jGh0x/In-Shot-20231119-124433570.jpg",
        width: 574,
        height: 571,
        alt: "Venga Mor Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venga Mor",
    description: "Tu compañía de élite en Bogotá.",
    images: ["https://i.ibb.co/XZ1jGh0x/In-Shot-20231119-124433570.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${playball.variable} dark`}>
      <body className="font-body antialiased bg-background">
        <main className="flex flex-col min-h-screen pb-16">
          <Providers>
            <>
              {children}
              <FloatingMascot />
              <FloatingClipsButton />
              <BottomNav />
            </>
          </Providers>
        </main>
        <Toaster richColors />
      </body>
    </html>
  );
}
