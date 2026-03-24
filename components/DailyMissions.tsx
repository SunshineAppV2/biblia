"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Zap, CheckCircle2, Target } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Storage helpers ────────────────────────────────────────────────────────

function getTodayKey(): string {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

interface MissionState {
    read1: boolean; // 1 capítulo
    read2: boolean; // 2 capítulos
    quiz1: boolean; // 1 quiz
}

function loadMissions(): MissionState {
    if (typeof window === "undefined") return { read1: false, read2: false, quiz1: false };
    try {
        const raw = localStorage.getItem(`biblequest_missions_${getTodayKey()}`);
        if (raw) return JSON.parse(raw);
    } catch {}
    return { read1: false, read2: false, quiz1: false };
}

function saveMissions(state: MissionState) {
    if (typeof window === "undefined") return;
    localStorage.setItem(`biblequest_missions_${getTodayKey()}`, JSON.stringify(state));
}

// ─── Exported trackers ──────────────────────────────────────────────────────

/** Call this every time a chapter is completed. Returns the XP bonus earned (0 if no new mission). */
export function trackDailyRead(): number {
    const state = loadMissions();
    let bonus = 0;

    if (!state.read1) {
        state.read1 = true;
        bonus += 15;
    } else if (!state.read2) {
        state.read2 = true;
        bonus += 30;
    }

    saveMissions(state);
    return bonus;
}

/** Call this every time a quiz is completed. Returns the XP bonus earned (0 if already done). */
export function trackDailyQuiz(): number {
    const state = loadMissions();
    if (state.quiz1) return 0;
    state.quiz1 = true;
    saveMissions(state);
    return 20;
}

// ─── Mission definitions ────────────────────────────────────────────────────

interface Mission {
    id: keyof MissionState;
    icon: React.ElementType;
    title: string;
    description: string;
    xp: number;
    color: string;
}

const MISSIONS: Mission[] = [
    {
        id: "read1",
        icon: BookOpen,
        title: "Primeira Leitura do Dia",
        description: "Leia 1 capítulo hoje",
        xp: 15,
        color: "text-accent",
    },
    {
        id: "read2",
        icon: BookOpen,
        title: "Leitor Dedicado",
        description: "Leia 2 capítulos hoje",
        xp: 30,
        color: "text-secondary",
    },
    {
        id: "quiz1",
        icon: Target,
        title: "Desafio do Quiz",
        description: "Complete 1 quiz",
        xp: 20,
        color: "text-primary",
    },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function DailyMissions() {
    const [missions, setMissions] = useState<MissionState>({ read1: false, read2: false, quiz1: false });

    useEffect(() => {
        setMissions(loadMissions());

        // Poll for external updates (when trackDailyRead/Quiz is called)
        const interval = setInterval(() => {
            setMissions(loadMissions());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const completedCount = Object.values(missions).filter(Boolean).length;
    const allDone = completedCount === 3;

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-secondary fill-current" />
                    Missões Diárias
                </h3>
                <span className="text-xs font-bold text-muted-foreground">
                    {completedCount}/3 completas
                </span>
            </div>

            {allDone && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-secondary/40 bg-secondary/10 px-4 py-3 flex items-center gap-3"
                >
                    <span className="text-2xl">🎉</span>
                    <div>
                        <p className="text-sm font-black text-primary">Todas as missões concluídas!</p>
                        <p className="text-xs text-muted-foreground">Volte amanhã para novas missões.</p>
                    </div>
                </motion.div>
            )}

            <div className="space-y-2.5">
                {MISSIONS.map((mission, i) => {
                    const done = missions[mission.id];
                    const Icon = mission.icon;
                    // For read2: only show progress if read1 is done
                    const active = mission.id === "read2" ? missions.read1 && !done : !done;
                    const progress = done ? 100 : active ? 50 : 0;

                    return (
                        <motion.div
                            key={mission.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className={cn(
                                "rounded-2xl border p-4 transition-all",
                                done
                                    ? "border-secondary/40 bg-secondary/10"
                                    : "border-primary/15 bg-white/70 backdrop-blur"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                                    done
                                        ? "bg-secondary/20 border-secondary/30"
                                        : "bg-primary/8 border-primary/15"
                                )}>
                                    <Icon className={cn("w-5 h-5", done ? "text-secondary" : mission.color)} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className={cn(
                                            "text-sm font-bold leading-tight",
                                            done ? "text-secondary" : "text-primary"
                                        )}>
                                            {mission.title}
                                        </p>
                                        <span className={cn(
                                            "text-[10px] font-black shrink-0",
                                            done ? "text-secondary" : "text-accent"
                                        )}>
                                            +{mission.xp} XP
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{mission.description}</p>

                                    {/* Progress bar */}
                                    <div className="mt-2 h-1 bg-primary/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className={cn("h-full rounded-full", done ? "bg-secondary" : "bg-secondary/40")}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${done ? 100 : active ? 50 : 0}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>

                                {/* Checkmark */}
                                <AnimatePresence>
                                    {done && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -30 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-secondary fill-secondary/20" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
