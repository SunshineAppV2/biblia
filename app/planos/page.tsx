"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, BookOpen, CheckCircle2, Clock, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Plan definitions ────────────────────────────────────────────────────────

interface Plan {
    id: string;
    name: string;
    description: string;
    icon: string;
    durationDays: number;
    totalChapters: number;
    chaptersPerDay: number;
    scope: string;
}

const PLANS: Plan[] = [
    {
        id: "bible_1_year",
        name: "Bíblia em 1 Ano",
        description: "Leia toda a Bíblia em 365 dias, cobrindo o Antigo e Novo Testamento.",
        icon: "📖",
        durationDays: 365,
        totalChapters: 1189,
        chaptersPerDay: 4,
        scope: "Todos os livros",
    },
    {
        id: "nt_3_months",
        name: "NT em 3 Meses",
        description: "Conheça o Novo Testamento completo em apenas 90 dias.",
        icon: "✝️",
        durationDays: 90,
        totalChapters: 260,
        chaptersPerDay: 3,
        scope: "Novo Testamento",
    },
    {
        id: "psalms_30_days",
        name: "Salmos em 30 Dias",
        description: "Mergulhe nos 150 Salmos ao longo de um mês.",
        icon: "🎵",
        durationDays: 30,
        totalChapters: 150,
        chaptersPerDay: 5,
        scope: "Salmos",
    },
    {
        id: "pentateuch_60_days",
        name: "Pentateuco em 60 Dias",
        description: "Explore os primeiros 5 livros da Bíblia com profundidade.",
        icon: "🏛️",
        durationDays: 60,
        totalChapters: 187,
        chaptersPerDay: 3,
        scope: "Gênesis a Deuteronômio",
    },
];

const STORAGE_KEY = "biblequest_plan";

interface ActivePlan {
    id: string;
    startDate: string; // ISO date string YYYY-MM-DD
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PlanosPage() {
    const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
    const [confirming, setConfirming] = useState<string | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setActivePlan(JSON.parse(raw));
        } catch {}
    }, []);

    const activate = (planId: string) => {
        const newPlan: ActivePlan = {
            id: planId,
            startDate: new Date().toISOString().slice(0, 10),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));
        setActivePlan(newPlan);
        setConfirming(null);
    };

    const deactivate = () => {
        localStorage.removeItem(STORAGE_KEY);
        setActivePlan(null);
    };

    const getDaysElapsed = (startDate: string): number => {
        const start = new Date(startDate + "T00:00:00");
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    };

    const getProgressPercent = (plan: Plan, startDate: string): number => {
        const elapsed = getDaysElapsed(startDate);
        return Math.min(100, Math.round((elapsed / plan.durationDays) * 100));
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="p-4 flex items-center justify-between bg-white/70 backdrop-blur border-b border-secondary/20 sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-primary" />
                </Link>
                <h1 className="text-lg font-black text-primary uppercase italic tracking-widest">
                    Planos de Leitura
                </h1>
                <div className="w-10" />
            </header>

            <main className="max-w-xl mx-auto p-6 space-y-6">
                {/* Intro */}
                <div className="text-center space-y-1 pt-2">
                    <p className="text-muted-foreground text-sm">
                        Escolha um plano para guiar sua leitura bíblica diária.
                    </p>
                </div>

                {/* Active plan highlight */}
                {activePlan && (() => {
                    const plan = PLANS.find(p => p.id === activePlan.id);
                    if (!plan) return null;
                    const elapsed = getDaysElapsed(activePlan.startDate);
                    const remaining = Math.max(0, plan.durationDays - elapsed);
                    const progress = getProgressPercent(plan, activePlan.startDate);
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-secondary/40 bg-secondary/10 p-5 space-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{plan.icon}</span>
                                <div className="flex-1">
                                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                                        Plano Ativo
                                    </span>
                                    <h2 className="text-lg font-black text-primary">{plan.name}</h2>
                                </div>
                                <CheckCircle2 className="w-6 h-6 text-secondary" />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{elapsed} dias decorridos</span>
                                    <span className="font-bold text-secondary">{remaining} dias restantes</span>
                                </div>
                                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full bg-secondary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground text-right">{progress}% concluído</p>
                            </div>

                            <button
                                onClick={deactivate}
                                className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors"
                            >
                                Cancelar plano
                            </button>
                        </motion.div>
                    );
                })()}

                {/* Plan cards */}
                <div className="space-y-4">
                    {PLANS.map((plan, i) => {
                        const isActive = activePlan?.id === plan.id;
                        const isConfirming = confirming === plan.id;

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className={cn(
                                    "rounded-2xl border p-5 space-y-4 transition-all",
                                    isActive
                                        ? "border-secondary/40 bg-secondary/10"
                                        : "border-primary/15 bg-white/70 backdrop-blur"
                                )}
                            >
                                {/* Plan header */}
                                <div className="flex items-start gap-3">
                                    <div className="text-3xl">{plan.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-black text-primary">{plan.name}</h3>
                                            {isActive && (
                                                <span className="text-[9px] font-black bg-secondary/20 text-secondary px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                    Ativo
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="rounded-xl bg-primary/5 border border-primary/10 p-2 text-center">
                                        <Clock className="w-3.5 h-3.5 text-primary mx-auto mb-0.5" />
                                        <div className="text-xs font-black text-primary">{plan.durationDays}d</div>
                                        <div className="text-[9px] text-muted-foreground">Duração</div>
                                    </div>
                                    <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-2 text-center">
                                        <BookOpen className="w-3.5 h-3.5 text-secondary mx-auto mb-0.5" />
                                        <div className="text-xs font-black text-secondary">{plan.chaptersPerDay}/dia</div>
                                        <div className="text-[9px] text-muted-foreground">Capítulos</div>
                                    </div>
                                    <div className="rounded-xl bg-accent/10 border border-accent/20 p-2 text-center">
                                        <Layers className="w-3.5 h-3.5 text-accent mx-auto mb-0.5" />
                                        <div className="text-xs font-black text-accent">{plan.totalChapters}</div>
                                        <div className="text-[9px] text-muted-foreground">Total cap.</div>
                                    </div>
                                </div>

                                <p className="text-[10px] text-muted-foreground font-semibold">
                                    {plan.scope}
                                </p>

                                {/* Action */}
                                {!isActive && (
                                    <AnimatePresence mode="wait">
                                        {isConfirming ? (
                                            <motion.div
                                                key="confirm"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex gap-2"
                                            >
                                                <button
                                                    onClick={() => activate(plan.id)}
                                                    className="flex-1 py-2.5 rounded-xl bg-secondary text-white text-sm font-black transition-all hover:opacity-90"
                                                >
                                                    Confirmar
                                                </button>
                                                <button
                                                    onClick={() => setConfirming(null)}
                                                    className="flex-1 py-2.5 rounded-xl border border-primary/20 text-muted-foreground text-sm font-bold transition-all hover:bg-primary/5"
                                                >
                                                    Cancelar
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                key="activate"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                onClick={() => {
                                                    if (activePlan) {
                                                        setConfirming(plan.id);
                                                    } else {
                                                        activate(plan.id);
                                                    }
                                                }}
                                                className="w-full py-2.5 rounded-xl border border-secondary/40 bg-secondary/10 text-secondary text-sm font-black transition-all hover:bg-secondary/20"
                                            >
                                                Iniciar Plano
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                )}

                                {isActive && (
                                    <p className="text-xs text-center text-secondary font-bold">
                                        Plano em andamento — continue lendo no dashboard!
                                    </p>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
