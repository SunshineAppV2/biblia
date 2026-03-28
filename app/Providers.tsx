"use client";

import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { MobileNav } from "@/components/MobileNav";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <AuthProvider>
                <LanguageProvider>
                    {children}
                    <MobileNav />
                </LanguageProvider>
            </AuthProvider>
        </ToastProvider>
    );
}
