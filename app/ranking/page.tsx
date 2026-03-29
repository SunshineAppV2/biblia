"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getGlobalLevelRanking, getWeeklyEncounterRanking, LeaderboardEntry } from "@/lib/leaderboard-service";
import { Trophy, Zap, Star, Crown, ChevronRight, Gem, Info, Users, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileNav } from "@/components/MobileNav";
import { calculateLevel } from "@/lib/levels";
import { cn } from "@/lib/utils";

type Tab = "level" | "encounter";
type View = "current" | "last";
type Scope = "league" | "global";

export default function RankingPage() {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("level");
    const [view, setView] = useState<View>("current");
    const [scope, setScope] = useState<Scope>("league");
    const [ranking, setRanking] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            setLoading(true);
            try {
                const leagueFilter = scope === "league" ? profile?.currentLeague : undefined;
                const isLastWeek = view === "last";

                if (activeTab === "level") {
                    const data = await getGlobalLevelRanking(leagueFilter, isLastWeek);
                    setRanking(data);
                } else {
                    const data = await getWeeklyEncounterRanking(leagueFilter, isLastWeek);
                    setRanking(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRanking();
    }, [activeTab, view, scope, profile?.currentLeague]);

    return (
        <div className="min-h-screen bg-background pb-32 pt-12 px-6 font-sans max-w-2xl mx-auto">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-black text-primary flex items-center gap-4 italic tracking-tight">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center">
                        <Trophy className="w-7 h-7 text-secondary" />
                    </div>
                    Hall da Fama
                </h1>
                <p className="text-sm text-muted-foreground mt-3 font-medium leading-relaxed">
                   Os maiores leitores e estudiosos da Palavra. <br />
                   <span className="text-secondary font-bold underline underline-offset-4 decoration-secondary/30">
                       {activeTab === "level" ? "Ranking por nível de sabedoria." : "Ranking da Jornada do Saber."}
                   </span>
                </p>
            </header>

            {/* View & Scope Selector */}
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
                        Minha Liga ({profile?.currentLeague})
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

            {/* Tabs */}
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

            {/* Reward Info */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 rounded-[32px] bg-gradient-to-br from-[#0E1B5C] to-[#1A237E] text-white shadow-xl mb-8 border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-inner">
                            <Gem className="w-8 h-8 text-secondary animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/80">Recompensa</p>
                            <h3 className="text-xl font-black italic tracking-tighter">
                                {activeTab === "level" ? "Conquiste Gemas subindo de nível!" : "1º Lugar ganha 50 Gemas!"}
                            </h3>
                            <p className="text-[10px] opacity-60 font-medium mt-1">Sorteio acontece todo Domingo às 21:00.</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-20 bg-white/10 rounded-[28px] animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : ranking.length === 0 ? (
                    <div className="py-20 text-center opacity-40">
                        <Info className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-bold uppercase tracking-widest text-xs">Ainda não há dados suficientes.</p>
                    </div>
                ) : (
                    ranking.map((entry, index) => {
                        const isFirst = index === 0;
                        const isMe = entry.uid === user?.uid;
                        const level = activeTab === "level" ? calculateLevel(entry.xp ?? entry.value) : null;

                        return (
                            <motion.div
                                key={entry.uid}
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
                    })
                )}
            </div>

            <MobileNav />
        </div>
    );
}
