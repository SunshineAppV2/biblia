"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Book, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Plano", icon: Book, href: "/planos" },
    { label: "Conquistas", icon: Trophy, href: "/conquistas" },
    { label: "Perfil", icon: User, href: "/profile" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
            {/* Glass effect background */}
            <div className="absolute inset-x-0 bottom-0 h-[72px] bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-primary/10" />
            
            <div className="relative h-[72px] max-w-md mx-auto flex items-center justify-around px-4">
                {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative py-2 px-4 rounded-2xl",
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
                            <Icon className={cn("w-6 h-6", active ? "stroke-[2.5px] drop-shadow-[0_0_8px_rgba(212,164,48,0.5)]" : "stroke-[1.5px]")} />
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest",
                                active ? "text-secondary" : "text-foreground/50"
                            )}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
            
            {/* Safe area spacer for mobile notches */}
            <div className="h-[env(safe-area-inset-bottom)] bg-white/80 dark:bg-black/80 backdrop-blur-xl" />
        </nav>
    );
}
