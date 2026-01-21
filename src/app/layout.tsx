import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import { BottomNav } from "@/components/bottom-nav";
import { Toaster } from "sonner";

import "@radix-ui/themes/styles.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./globals.css";
import { UserProvider } from "@/context/user-context";

export const metadata: Metadata = {
  title: "Venga Mor",
  description: "Tu compañía de élite en Bogotá.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Playball&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-body antialiased bg-background">
        <Theme>
          <UserProvider>
            <main className="flex flex-col min-h-screen pb-16">
              {children}

              <BottomNav />
            </main>
          </UserProvider>
        </Theme>

        <Toaster richColors />
      </body>
    </html>
  );
}
