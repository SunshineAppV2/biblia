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
    quiz_perfect: boolean; // 100% no quiz
    early_bird: boolean; // Ler antes das 9h
    marathon: boolean; // Ler 5 capítulos
    read_count?: number; // Contador interno de capítulos no dia
}

function loadMissions(): MissionState {
    const defaultState: MissionState = { read1: false, read2: false, quiz1: false, quiz_perfect: false, early_bird: false, marathon: false, read_count: 0 };
    if (typeof window === "undefined") return defaultState;
    try {
        const raw = localStorage.getItem(`biblequest_missions_${getTodayKey()}`);
        if (raw) return { ...defaultState, ...JSON.parse(raw) };
    } catch {}
    return defaultState;
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
    const now = new Date();
    const hour = now.getHours();

    state.read_count = (state.read_count || 0) + 1;

    // 1 Capítulo
    if (!state.read1) {
        state.read1 = true;
        bonus += 15;
    } 
    
    // 2 Capítulos
    if (state.read_count >= 2 && !state.read2) {
        state.read2 = true;
        bonus += 30;
    }

    // Madrugador (antes das 9h)
    if (hour < 9 && !state.early_bird) {
        state.early_bird = true;
        bonus += 25;
    }

    // Maratonista (5 capítulos)
    if (state.read_count >= 5 && !state.marathon) {
        state.marathon = true;
        bonus += 60;
    }

    saveMissions(state);
    return bonus;
}

/** Call this every time a quiz is completed. Returns the XP bonus earned (0 if already done). */
export function trackDailyQuiz(isPerfect: boolean = false): number {
    const state = loadMissions();
    let bonus = 0;

    if (!state.quiz1) {
        state.quiz1 = true;
        bonus += 20;
    }

    if (isPerfect && !state.quiz_perfect) {
        state.quiz_perfect = true;
        bonus += 30;
    }

    saveMissions(state);
    return bonus;
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
        title: "Primeira Leitura",
        description: "Leia 1 capítulo hoje",
        xp: 15,
        color: "text-accent",
    },
    {
        id: "early_bird",
        icon: Zap,
        title: "Madrugador",
        description: "Leia 1 cap. antes das 09:00",
        xp: 25,
        color: "text-yellow-500",
    },
    {
        id: "quiz1",
        icon: Target,
        title: "Desafio do Quiz",
        description: "Complete 1 quiz",
        xp: 20,
        color: "text-primary",
    },
    {
        id: "quiz_perfect",
        icon: Target,
        title: "Gênio do Quiz",
        description: "Acerte 100% em um quiz",
        xp: 30,
        color: "text-blue-500",
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
        id: "marathon",
        icon: Zap,
        title: "Maratona Bíblica",
        description: "Leia 5 capítulos hoje",
        xp: 60,
        color: "text-red-500",
    },
];

function getMissionsForToday(): Mission[] {
    const d = new Date();
    const day = d.getDate() + d.getMonth() * 31; // More stable seed
    const fixed = MISSIONS[0];
    const others = MISSIONS.slice(1);
    
    // Pick 2 from others
    const startIdx = day % others.length;
    const selection = [
        fixed,
        others[startIdx],
        others[(startIdx + 1) % others.length]
    ];
    return selection;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function DailyMissions() {
    const [missions, setMissions] = useState<MissionState>({ read1: false, read2: false, quiz1: false, quiz_perfect: false, early_bird: false, marathon: false, read_count: 0 });
    const [activeMissions, setActiveMissions] = useState<Mission[]>([]);

    useEffect(() => {
        setMissions(loadMissions());
        setActiveMissions(getMissionsForToday());

        // Poll for external updates (when trackDailyRead/Quiz is called)
        const interval = setInterval(() => {
            setMissions(loadMissions());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const completedCount = activeMissions.filter(m => missions[m.id] === true).length;
    const allDone = completedCount === activeMissions.length;


    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-secondary fill-current" />
                    Missões Diárias
                </h3>
                <span className="text-xs font-bold text-muted-foreground">
                    {completedCount}/{activeMissions.length} completas
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
                {activeMissions.map((mission, i) => {
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
