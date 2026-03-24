"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
    adSlot: string;
    adFormat?: "auto" | "horizontal";
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export function AdBanner({ adSlot, adFormat = "auto", className }: AdBannerProps) {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current || !adSlot) return;
        initialized.current = true;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, [adSlot]);

    // Don't render if no publisher ID configured
    if (!process.env.NEXT_PUBLIC_ADSENSE_ID || process.env.NEXT_PUBLIC_ADSENSE_ID.includes("XXXX")) {
        return null;
    }

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true"
            />
        </div>
    );
}
