"use client";

import { cn } from "@/lib/utils";

interface RankingFiltersProps {
    view: "current" | "last";
    setView: (view: "current" | "last") => void;
    scope: "league" | "global";
    setScope: (scope: "league" | "global") => void;
    currentLeague?: string;
}

export function RankingFilters({ 
    view, 
    setView, 
    scope, 
    setScope, 
    currentLeague 
}: RankingFiltersProps) {
    return (
        <div className="flex flex-col gap-4 mb-8">
            <div className="flex gap-2">
                <button
                    onClick={() => setView("current")}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                        view === "current" ? "bg-primary text-white border-primary" : "bg-white/50 text-muted-foreground border-secondary/10"
                    )}
                >
                    Esta Semana
                </button>
                <button
                    onClick={() => setView("last")}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                        view === "last" ? "bg-primary text-white border-primary" : "bg-white/50 text-muted-foreground border-secondary/10"
                    )}
                >
                    Semana Passada
                </button>
            </div>
            
            <div className="flex gap-2">
                <button
                    onClick={() => setScope("league")}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                        scope === "league" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-white/50 text-muted-foreground border-secondary/10"
                    )}
                >
                    Minha Liga ({currentLeague || "..."})
                </button>
                <button
                    onClick={() => setScope("global")}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                        scope === "global" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-white/50 text-muted-foreground border-secondary/10"
                    )}
                >
                    Global
                </button>
            </div>
        </div>
    );
}
