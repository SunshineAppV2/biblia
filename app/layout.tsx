import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Providers } from "./Providers";
import { SplashScreen } from "@/components/SplashScreen";
import "./globals.css";

export const metadata: Metadata = {
    title: "AnoBíblico+",
    description: "Sua jornada diária através das Escrituras de forma gamificada e em comunidade.",
    manifest: "/manifest.json",
    openGraph: {
        title: "AnoBíblico+",
        description: "Transforme sua leitura bíblica em uma jornada épica.",
        url: 'https://ano-biblico.vercel.app',
        siteName: 'AnoBíblico+',
        images: [
            {
                url: '/icon-512x512.png',
                width: 512,
                height: 512,
            },
        ],
        locale: 'pt-BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AnoBíblico+',
        description: 'Sua jornada diária através das Escrituras.',
        images: ['/icon-512x512.png'],
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "AnoBíblico+",
    },
    icons: {
        apple: "/icon-192x192.png",
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
                <script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
                    crossOrigin="anonymous"
                />
            </head>
            <body className="antialiased">
                <Script
                    id="register-sw"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker.register('/sw.js').then(
                                        function(registration) {
                                            console.log('Service Worker registrado com sucesso: ', registration.scope);
                                        },
                                        function(err) {
                                            console.log('Falha ao registrar o Service Worker: ', err);
                                        }
                                    );
                                });
                            }
                        `,
                    }}
                />
                <SplashScreen />
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
