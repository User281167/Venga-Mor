import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { Theme } from "@radix-ui/themes";
import { BottomNav } from "@/components/bottom-nav";
import "@radix-ui/themes/styles.css";
import "./globals.css";

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
          <div className="flex flex-col min-h-screen">
            {children}

            <BottomNav />
          </div>
          <ToastContainer />
        </Theme>
      </body>
    </html>
  );
}
