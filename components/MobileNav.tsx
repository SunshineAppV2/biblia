"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Book, Trophy, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "./AuthProvider";

import { useLanguage } from "./LanguageProvider";

export function MobileNav() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { locale, t } = useLanguage();

    const NAV_ITEMS = [
        { label: locale === "pt" ? "Início" : "Home", icon: Home, href: "/" },
        { label: locale === "pt" ? "Plano" : "Plan", icon: Book, href: "/planos" },
        { label: locale === "pt" ? "Tribos" : "Tribes", icon: Trophy, href: "/tribos" },
        { label: locale === "pt" ? "Perfil" : "Profile", icon: User, href: "/profile" },
    ];

    // Auto-hide logic
    if (!user) return null;
    if (pathname.startsWith("/admin")) return null;
    
    // Check if we are in reading mode (only on home page when isReading is managed externally)
    // Actually, we can't easily know isReading from here if it's local state.
    // But we can check if the user is on certain paths.
    
    // If the user wants the menu to STAY even after clicked, it means it should always be visible 
    // on these main pages.

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
            {/* Dark/Navy Glass background for better contrast with "letras claras" */}
            <div className="absolute inset-x-0 bottom-0 h-[72px] bg-[#0E1B5C]/95 backdrop-blur-2xl border-t border-white/5 shadow-[0_-8px_30px_rgba(0,0,0,0.3)]" />
            
            <div className="relative h-[72px] max-w-md mx-auto flex items-center justify-around px-2">
                {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative py-2 px-3 rounded-2xl",
                                active 
                                    ? "text-secondary scale-110" 
                                    : "text-white/40 hover:text-white/70"
                            )}
                        >
                            {active && (
                                <motion.div 
                                    layoutId="nav-glow"
                                    className="absolute inset-0 bg-secondary/15 rounded-2xl blur-md" 
                                />
                            )}
                            <Icon className={cn("w-5 h-5", active ? "stroke-[2.5px] drop-shadow-[0_0_8px_rgba(212,164,48,0.5)]" : "stroke-[1.5px]")} />
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-tighter",
                                active ? "text-secondary" : "text-white/60"
                            )}>{item.label}</span>
                        </Link>
                    );
                })}

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="flex flex-col items-center justify-center gap-1 transition-all duration-300 relative py-2 px-3 rounded-2xl text-red-400/70 hover:text-red-400"
                >
                    <LogOut className="w-5 h-5 stroke-[1.5px]" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                        {locale === "pt" ? "Sair" : "Logout"}
                    </span>
                </button>
            </div>
            
            {/* Safe area spacer */}
            <div className="h-[env(safe-area-inset-bottom)] bg-[#0E1B5C]/95 backdrop-blur-2xl" />
        </nav>
    );
}

