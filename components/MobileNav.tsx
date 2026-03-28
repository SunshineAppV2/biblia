"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Book, Trophy, User, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "./AuthProvider";

const NAV_ITEMS = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Plano", icon: Book, href: "/planos" },
    { label: "Arena", icon: Zap, href: "/arena" },
    { label: "Tribos", icon: Trophy, href: "/tribos" },
    { label: "Perfil", icon: User, href: "/profile" },
];

export function MobileNav() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <nav className="fixed bottom-0 sm:bottom-6 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-max z-[100] transition-all duration-700">
            <div className="absolute inset-x-0 bottom-0 h-[72px] sm:h-[64px] bg-[#0E1B5C]/95 backdrop-blur-2xl border-t sm:border border-white/5 shadow-[0_-8px_30px_rgba(0,0,0,0.3)] sm:rounded-full" />
            
            <div className="relative h-[72px] sm:h-[64px] max-w-md mx-auto sm:mx-0 sm:min-w-[420px] flex items-center justify-between px-8">
                {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative py-2 px-3",
                                active 
                                    ? "text-secondary scale-110" 
                                    : "text-white/40 hover:text-white/70"
                            )}
                        >
                            <div className="relative">
                                <Icon className={cn("w-6 h-6 transition-all duration-500", active ? "stroke-[2.5px] drop-shadow-[0_0_12px_rgba(184,130,10,0.6)]" : "stroke-[1.5px] opacity-60")} />
                                {active && (
                                    <motion.div 
                                        layoutId="active-dot"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary shadow-[0_0_8px_rgba(184,130,10,0.8)]"
                                    />
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-[0.1em]",
                                active ? "text-secondary opacity-100" : "text-white/40 opacity-60"
                            )}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
            
            {/* Safe area spacer for mobile - not needed in floating mode on sm */}
            <div className="h-[env(safe-area-inset-bottom)] bg-[#0E1B5C]/95 backdrop-blur-2xl sm:hidden" />
        </nav>
    );
}
