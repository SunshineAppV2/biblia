"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LevelProgressBarProps {
    level: number;
    progressPercentage: number;
    xpInCurrentLevel: number;
    xpRequiredForNextLevel: number;
    title?: string;
    className?: string;
    showLabel?: boolean;
}

export function LevelProgressBar({
    level,
    progressPercentage,
    xpInCurrentLevel,
    xpRequiredForNextLevel,
    title,
    className,
    showLabel = true
}: LevelProgressBarProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {showLabel && (
                <div className="flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                        <span className="font-bold text-white">
                            Nível {level}
                        </span>
                        {title && (
                            <span className="text-[10px] text-primary uppercase tracking-widest font-bold">
                                {title}
                            </span>
                        )}
                    </div>
                    <span className="text-muted-foreground">
                        {xpInCurrentLevel} / {xpRequiredForNextLevel} XP
                    </span>
                </div>
            )}

            <div className="relative h-2 bg-primary/20 rounded-full overflow-hidden border border-secondary/15">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full shadow-[0_0_12px_rgba(66,165,245,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "linear"
                    }}
                />
            </div>
        </div>
    );
}
