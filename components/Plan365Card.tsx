"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, Circle, ChevronRight, Trophy, Clock, AlertTriangle, Star } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import {
    PLAN_365, Plan365Day, Plan365Chapter,
    getPlan365Config, getTodayPlanDay, getLatePlanDays, getPlan365Progress,
} from "@/lib/reading-plan-365";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { awardXp } from "@/lib/firestore";
import { useToast } from "@/components/Toast";

interface Plan365CardProps {
    onNavigate: (bookId: string, chapter: number) => void;
}

type ReadStatus = "loading" | "ready";

export function Plan365Card({ onNavigate }: Plan365CardProps) {
    const { user, profile } = useAuth();
    const { showToast } = useToast();

    const [status, setStatus] = useState<ReadStatus>("loading");
    const [todayDay, setTodayDay] = useState<Plan365Day | null>(null);
    const [lateDays, setLateDays] = useState<Plan365Day[]>([]);
    const [completedKeys, setCompletedKeys] = useState<Set<string>>(new Set());
    const [progress, setProgress] = useState({ done: 0, total: 365, percent: 0 });
    const [showLate, setShowLate] = useState(false);

    const loadData = useCallback(async () => {
        if (!user || !profile) return;
        const config = getPlan365Config();
        if (!config) return;

        setStatus("loading");

        // Fetch completed chapters from Firestore
        const cycle = profile.cycle || 1;
        const progressRef = collection(db, "users", user.uid, "reading_progress");
        const snap = await getDocs(progressRef);
        const keys = new Set<string>();
        snap.forEach(d => {
            // progressId format: "{bookId}_{chapter}_cycle{n}"
            const id = d.id;
            const match = id.match(/^(.+)_(\d+)_cycle(\d+)$/);
            if (match && parseInt(match[3]) === cycle) {
                keys.add(`${match[1]}_${match[2]}`);
            }
        });
        setCompletedKeys(keys);

        const today = getTodayPlanDay(config);
        const late = getLatePlanDays(config, keys);
        const prog = getPlan365Progress(keys);

        setTodayDay(today);
        setLateDays(late);
        setProgress(prog);
        setStatus("ready");
    }, [user, profile]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const config = getPlan365Config();
    if (!config) return null;
    if (!user || !profile) return null;
    if (status === "loading") return (
        <div className="rounded-[28px] border border-secondary/20 bg-white/60 backdrop-blur p-5 animate-pulse h-40" />
    );
    if (!todayDay) return null;

    const todayDone = todayDay.chapters.every(ch => completedKeys.has(`${ch.bookId}_${ch.chapter}`));
    const todayUnread = todayDay.chapters.filter(ch => !completedKeys.has(`${ch.bookId}_${ch.chapter}`));
    const todayRead = todayDay.chapters.filter(ch => completedKeys.has(`${ch.bookId}_${ch.chapter}`));
    const hasLate = lateDays.length > 0;

    function handleReadChapter(ch: Plan365Chapter, isLate: boolean) {
        onNavigate(ch.bookId, ch.chapter);
    }

    async function handleDayBonusIfComplete() {
        if (!todayDay) return;
        const allDone = todayDay.chapters.every(ch => completedKeys.has(`${ch.bookId}_${ch.chapter}`));
        if (!allDone) return;
        try {
            await awardXp({ type: "PLAN365_BONUS" });
            showToast("+30 XP bônus! Plano do dia completo!", "achievement");
        } catch {
            // Bonus already awarded or error — silent
        }
    }

    // Book label for display (unique books in today's plan)
    const bookLabels = (() => {
        const seen = new Set<string>();
        const labels: string[] = [];
        for (const ch of todayDay.chapters) {
            if (!seen.has(ch.bookId)) {
                seen.add(ch.bookId);
                labels.push(ch.bookName);
            }
        }
        return labels;
    })();

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-secondary/30 bg-white/80 backdrop-blur shadow-sm overflow-hidden"
        >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Bíblia em 1 Ano</p>
                        <p className="text-sm font-black text-primary leading-tight">
                            {todayDay.dateMMDD} · {bookLabels.join(" + ")}
                        </p>
                    </div>
                </div>
                {todayDone && (
                    <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full uppercase tracking-widest shrink-0">
                        <CheckCircle className="w-3 h-3" /> Concluído
                    </span>
                )}
            </div>

            {/* Progress bar */}
            <div className="px-5 pb-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground font-bold">
                        Progresso anual
                    </span>
                    <span className="text-[10px] font-black text-secondary">
                        {progress.done}/365 dias · {progress.percent}%
                    </span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary/10 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-secondary transition-all duration-700"
                        style={{ width: `${progress.percent}%` }}
                    />
                </div>
            </div>

            {/* Today's chapters */}
            <div className="px-5 pb-4 space-y-1.5">
                {todayDay.chapters.map((ch) => {
                    const done = completedKeys.has(`${ch.bookId}_${ch.chapter}`);
                    return (
                        <button
                            key={`${ch.bookId}_${ch.chapter}`}
                            onClick={() => !done && handleReadChapter(ch, false)}
                            disabled={done}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                                done
                                    ? "bg-green-50 border border-green-100 opacity-70"
                                    : "bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 active:scale-95"
                            }`}
                        >
                            {done
                                ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                : <Circle className="w-4 h-4 text-secondary/40 shrink-0" />
                            }
                            <span className={`text-sm font-bold flex-1 capitalize ${done ? "text-green-700 line-through decoration-green-400/60" : "text-primary"}`}>
                                {ch.bookName} {ch.chapter}
                            </span>
                            {!done && (
                                <span className="flex items-center gap-1 text-[10px] font-black text-secondary/60">
                                    <Trophy className="w-3 h-3" /> +50 XP
                                </span>
                            )}
                            {!done && <ChevronRight className="w-3.5 h-3.5 text-secondary/40 shrink-0" />}
                        </button>
                    );
                })}
            </div>

            {/* Day complete bonus hint */}
            {!todayDone && todayUnread.length === 1 && (
                <div className="px-5 pb-3">
                    <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                        <Star className="w-3 h-3" />
                        Leia o último capítulo e ganhe +30 XP bônus!
                    </p>
                </div>
            )}

            {/* Late days section */}
            {hasLate && (
                <div className="border-t border-secondary/10">
                    <button
                        onClick={() => setShowLate(v => !v)}
                        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-secondary/5 transition-colors"
                    >
                        <span className="flex items-center gap-2 text-xs font-black text-amber-600">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {lateDays.length} {lateDays.length === 1 ? "dia atrasado" : "dias atrasados"}
                            <span className="text-[10px] text-muted-foreground font-medium">(+10 XP cada)</span>
                        </span>
                        <ChevronRight className={`w-4 h-4 text-secondary/40 transition-transform ${showLate ? "rotate-90" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {showLate && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="px-5 pb-4 space-y-1">
                                    {lateDays.slice(0, 7).map(lateDay => (
                                        lateDay.chapters
                                            .filter(ch => !completedKeys.has(`${ch.bookId}_${ch.chapter}`))
                                            .map(ch => (
                                                <button
                                                    key={`late_${ch.bookId}_${ch.chapter}`}
                                                    onClick={() => handleReadChapter(ch, true)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-amber-50/60 border border-amber-100 hover:bg-amber-50 active:scale-95 transition-all text-left"
                                                >
                                                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                                    <span className="text-xs font-bold text-primary flex-1 capitalize">
                                                        {ch.bookName} {ch.chapter}
                                                        <span className="text-[10px] text-muted-foreground ml-1">({lateDay.dateMMDD})</span>
                                                    </span>
                                                    <span className="text-[10px] font-black text-amber-600">+10 XP</span>
                                                    <ChevronRight className="w-3 h-3 text-amber-400 shrink-0" />
                                                </button>
                                            ))
                                    ))}
                                    {lateDays.length > 7 && (
                                        <p className="text-[10px] text-center text-muted-foreground pt-1">
                                            + {lateDays.length - 7} dias mais
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}
