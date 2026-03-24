import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Providers } from "./Providers";
import { SplashScreen } from "@/components/SplashScreen";
import "./globals.css";

export const metadata: Metadata = {
    title: "BibleQuest",
    description: "Jornada Bíblica Gamificada",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "BibleQuest",
    },
    other: {
        "google-adsense-account": "ca-pub-6990451998593893",
    },
};

export const viewport: Viewport = {
    themeColor: "#1A237E",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <head>
                <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            </head>
            <body className="antialiased">
                <SplashScreen />
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
