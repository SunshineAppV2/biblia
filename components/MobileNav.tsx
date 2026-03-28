"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Book, Trophy, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "./AuthProvider";

const NAV_ITEMS = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Plano", icon: Book, href: "/planos" },
    { label: "Tribos", icon: Trophy, href: "/tribos" },
    { label: "Perfil", icon: User, href: "/profile" },
];

export function MobileNav() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
            {/* Glass effect background */}
            <div className="absolute inset-x-0 bottom-0 h-[72px] bg-white/80 dark:bg-black/90 backdrop-blur-xl border-t border-primary/10" />
            
            <div className="relative h-[72px] max-w-md mx-auto flex items-center justify-around px-2">
                {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative py-2 px-3 rounded-2xl",
                                active 
                                    ? "text-secondary scale-110" 
                                    : "text-foreground/40 hover:text-foreground/70"
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
                                "text-[9px] font-bold uppercase tracking-widest",
                                active ? "text-secondary" : "text-foreground/50"
                            )}>{item.label}</span>
                        </Link>
                    );
                })}

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative py-2 px-3 rounded-2xl text-red-500/60 hover:text-red-500"
                >
                    <LogOut className="w-5 h-5 stroke-[1.5px]" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Sair</span>
                </button>
            </div>
            
            {/* Safe area spacer for mobile notches */}
            <div className="h-[env(safe-area-inset-bottom)] bg-white/80 dark:bg-black/90 backdrop-blur-xl" />
        </nav>
    );
}
