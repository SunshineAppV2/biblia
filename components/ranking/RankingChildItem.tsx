"use client";

import { motion } from "framer-motion";
import { Crown, Gem, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateLevel } from "@/lib/levels";
import { LeaderboardEntry } from "@/lib/leaderboard-service";

interface RankingChildItemProps {
    entry: LeaderboardEntry;
    index: number;
    isMe: boolean;
    activeTab: "level" | "encounter";
}

export function RankingChildItem({ entry, index, isMe, activeTab }: RankingChildItemProps) {
    const isFirst = index === 0;
    const level = activeTab === "level" ? calculateLevel(entry.xp ?? entry.value) : null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "group relative flex items-center justify-between p-5 rounded-[28px] transition-all border shadow-sm",
                isFirst 
                    ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/10 h-24" 
                    : isMe 
                        ? "bg-white border-primary/20 ring-2 ring-primary/10" 
                        : "bg-white/40 dark:bg-white/5 border-secondary/10 hover:border-secondary/30"
            )}
        >
            {isFirst && (
                <div className="absolute -top-3 -left-3 rotate-[-15deg] z-20">
                    <div className="p-2 bg-yellow-400 rounded-xl shadow-xl shadow-yellow-600/30">
                        <Crown className="w-5 h-5 text-white fill-current" />
                    </div>
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black",
                    isFirst ? "bg-white/20 text-white" : "text-muted-foreground"
                )}>
                    #{index + 1}
                </div>
                <div className="relative">
                    {entry.photoURL ? (
                        <img src={entry.photoURL} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-white/10 shadow-md" />
                    ) : (
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black border border-secondary/10 shadow-inner">
                            {entry.displayName?.[0] || "?"}
                        </div>
                    )}
                    {isMe && !isFirst && <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />}
                </div>
                <div>
                    <p className={cn(
                        "font-black text-sm tracking-tight",
                        isFirst ? "text-white" : "text-primary"
                    )}>
                        {entry.displayName} {isMe && "(Você)"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        {entry.totalChapters !== undefined && entry.totalChapters > 0 && (
                            <span className={cn(
                                "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/10 border border-white/5",
                                isFirst ? "text-white" : "text-primary/40"
                            )}>
                                📖 {entry.totalChapters} caps
                            </span>
                        )}
                        {level !== null && (
                            <span className={cn(
                                "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                                isFirst ? "bg-white/20 text-white" : "bg-primary/5 text-primary/60"
                            )}>
                                Nível {level}
                            </span>
                        )}
                        <span className={cn(
                            "text-[10px] font-bold opacity-60",
                            isFirst ? "text-white" : "text-primary"
                        )}>
                            {activeTab === "level" ? `${entry.value} XP` : `${entry.value === 1 ? "1 Encontro" : `${entry.value} Encontros`}`}
                        </span>
                    </div>
                </div>
            </div>

            <div className={cn(
                "flex flex-col items-end gap-1.5",
                isFirst ? "opacity-100" : "opacity-40 group-hover:opacity-100"
            )}>
                {isFirst ? (
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center gap-2">
                        <Gem className="w-4 h-4 text-white fill-current" />
                        <span className="text-xs font-black">+50</span>
                    </div>
                ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
            </div>
        </motion.div>
    );
}
