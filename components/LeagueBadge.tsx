"use client";

import { LeagueTier, LEAGUE_CONFIGS, migrateLegacyLeague } from "@/lib/leagues";
import { cn } from "@/lib/utils";
import { Shield, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface LeagueBadgeProps {
    tier: LeagueTier;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    className?: string;
}

export function LeagueBadge({ tier, size = "md", showLabel = true, className }: LeagueBadgeProps) {
    const resolvedTier = migrateLegacyLeague(tier);
    const config = LEAGUE_CONFIGS[resolvedTier];

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-20 h-20 text-xl",
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-10 h-10",
    };

    return (
        <div className={cn("flex flex-col items-center gap-2", className)}>
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={cn(
                    "relative flex items-center justify-center rounded-2xl shadow-lg transform rotate-3",
                    sizeClasses[size],
                    "bg-gradient-to-br",
                    config.gradient
                )}
            >
                <Shield className={cn("text-white/90 fill-white/20", iconSizes[size])} />

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm -z-10 animate-pulse" />
            </motion.div>

            {showLabel && (
                <div className="flex flex-col items-center">
                    <span className={cn("font-black uppercase italic tracking-tighter text-white", size === "lg" ? "text-xl" : "text-xs")}>
                        {config.label}
                    </span>
                    {size === "lg" && (
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1 opacity-60 text-center max-w-[120px]">
                            {config.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
