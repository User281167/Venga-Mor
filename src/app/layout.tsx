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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Venga Mor",
  },
  icons: {
    icon: "https://i.ibb.co/jk9tgFjs/In-Shot-20251127-124506071.gif",
    apple: "https://i.ibb.co/jk9tgFjs/In-Shot-20251127-124506071.gif",
  },
  openGraph: {
    title: "Venga Mor",
    description: "Tu compañía de élite en Bogotá.",
    images: [
      {
        url: "https://i.ibb.co/jk9tgFjs/In-Shot-20251127-124506071.gif",
        width: 512,
        height: 512,
        alt: "Venga Mor Logo",
      },
    ],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${playball.variable} dark`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-body antialiased bg-background">
        <main className="flex flex-col min-h-screen">
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