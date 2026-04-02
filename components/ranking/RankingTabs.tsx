"use client";

import { Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingTabsProps {
    activeTab: "level" | "encounter";
    setActiveTab: (tab: "level" | "encounter") => void;
}

export function RankingTabs({ activeTab, setActiveTab }: RankingTabsProps) {
    return (
        <div className="flex p-1.5 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-secondary/10 rounded-[30px] mb-8 shadow-sm">
            <button
                onClick={() => setActiveTab("level")}
                className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === "level" 
                        ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                        : "text-muted-foreground hover:text-primary"
                )}
            >
                <Star className={cn("w-4 h-4", activeTab === "level" ? "fill-current" : "")} />
                Nível Geral
            </button>
            <button
                onClick={() => setActiveTab("encounter")}
                className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === "encounter" 
                        ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                        : "text-muted-foreground hover:text-primary"
                )}
            >
                <Zap className={cn("w-4 h-4", activeTab === "encounter" ? "fill-current" : "")} />
                Jornada Semanal
            </button>
        </div>
    );
}
