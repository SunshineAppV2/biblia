"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ReadingTimerProps {
    averageTimeSeconds: number;
    onComplete: () => void;
    className?: string;
}

// DEV: set to true to disable focus enforcement during testing
const DISABLE_FOCUS_CHECK = true;

export function ReadingTimer({ averageTimeSeconds, onComplete, className }: ReadingTimerProps) {
    const [elapsed, setElapsed] = useState(0);
    const [isFocused, setIsFocused] = useState(true);
    const completedRef = useRef(false);

    useEffect(() => {
        if (DISABLE_FOCUS_CHECK) return; // Skip focus listeners during testing

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                setIsFocused(false);
                setElapsed(0);
            } else {
                setIsFocused(true);
            }
        };

        const handleBlur = () => { setIsFocused(false); setElapsed(0); };
        const handleFocus = () => { setIsFocused(true); };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (!completedRef.current) {
            interval = setInterval(() => {
                setElapsed((prev) => {
                    const newValue = prev + 1;
                    const target = averageTimeSeconds * 0.9;

                    if (newValue >= target && !completedRef.current) {
                        completedRef.current = true;
                        // Schedule outside the state updater to avoid React warning
                        setTimeout(onComplete, 0);
                    }
                    return newValue;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isFocused, averageTimeSeconds, onComplete]);

    // Calculate progress relative to the 90% target
    const targetSeconds = averageTimeSeconds * 0.9;
    const progress = Math.min((elapsed / targetSeconds) * 100, 100);

    if (completedRef.current) {
        return (
            <div className={cn("fixed bottom-0 left-0 w-full glass border-t border-secondary/30 p-4 animate-in slide-in-from-bottom", className)}>
                <div className="max-w-4xl mx-auto flex items-center justify-center font-bold gap-2 text-secondary">
                    <span>✨ Leitura Completada! XP Adicionado.</span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("fixed bottom-0 left-0 w-full glass border-t border-white/10 p-4 transition-all duration-300", className)}>
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">
                        <span className={isFocused ? "text-primary" : "text-red-500"}>
                            {isFocused ? "Foco Total Ativo" : "⚠️ Foco Perdido - Contador Resetado"}
                        </span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-1000 ease-linear",
                                isFocused
                                    ? "bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(66,165,245,0.5)]"
                                    : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                <div className="text-right min-w-[80px]">
                    <span className={cn("text-lg font-mono font-bold", isFocused ? "text-white" : "text-red-500")}>
                        {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                        / {Math.floor(averageTimeSeconds / 60)}:{(averageTimeSeconds % 60).toString().padStart(2, '0')}
                    </span>
                </div>
            </div>
        </div>
    );
}
