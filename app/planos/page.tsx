"use client";

import { useState } from "react";
import { READING_PLANS } from "@/lib/reading-plan";
import { getPlan365Config, setPlan365Config, clearPlan365Config, todayISO, PLAN_365 } from "@/lib/reading-plan-365";
import { useAuth } from "@/components/AuthProvider";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/Toast";
import { MobileNav } from "@/components/MobileNav";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Check, Clock, Calendar, ArrowLeft, BookOpen, Star, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── 365-Day Plan Activation Modal ───────────────────────────────────────────
function Plan365Modal({ onClose }: { onClose: () => void }) {
    const { showToast } = useToast();
    const router = useRouter();
    const [mode, setMode] = useState<"calendar" | "offset" | null>(null);
    const [customDate, setCustomDate] = useState(todayISO());

    function activate(selectedMode: "calendar" | "offset", startDate: string) {
        setPlan365Config({ mode: selectedMode, startDate });
        showToast("Plano Bíblia em 1 Ano ativado!", "achievement");
        onClose();
        router.push("/");
    }

    // Determine today's plan entry label for calendar mode
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const todayEntry = PLAN_365.find(d => d.dateMMDD === `${dd}/${mm}`);
    const todayLabel = todayEntry
        ? todayEntry.chapters.map(c => `${c.bookName} ${c.chapter}`).join(", ")
        : "—";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="w-full max-w-md bg-[#FDFBF7] rounded-[32px] p-6 space-y-5 shadow-2xl"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black italic tracking-tight">Bíblia em 1 Ano</h2>
                        <p className="text-xs text-muted-foreground font-medium">Escolha como começar</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-black/5">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Option 1: Calendar alignment */}
                    <button
                        onClick={() => activate("calendar", todayISO())}
                        className="w-full text-left p-4 rounded-2xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 active:scale-98 transition-all group"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-200 flex items-center justify-center shrink-0">
                                <Calendar className="w-4.5 h-4.5 text-amber-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-sm text-amber-900">Seguir o calendário</p>
                                <p className="text-xs text-amber-700/80 font-medium leading-snug mt-0.5">
                                    Leia a porção de hoje ({dd}/{mm}):<br/>
                                    <span className="font-black">{todayLabel}</span>
                                </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-amber-400 mt-1 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>

                    {/* Option 2: Start from day 1 (Gênesis 1) */}
                    <button
                        onClick={() => activate("offset", todayISO())}
                        className="w-full text-left p-4 rounded-2xl border-2 border-secondary/30 bg-white hover:bg-secondary/5 active:scale-98 transition-all group"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                                <BookOpen className="w-4.5 h-4.5 text-secondary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-sm text-primary">Começar do início</p>
                                <p className="text-xs text-muted-foreground font-medium leading-snug mt-0.5">
                                    Começa hoje com Gênesis 1‑4 e avança um dia por vez.
                                </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-secondary/40 mt-1 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>

                    {/* Option 3: Custom start date */}
                    <div className="p-4 rounded-2xl border-2 border-black/5 bg-white space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                                <Star className="w-4.5 h-4.5 text-black/40" />
                            </div>
                            <div>
                                <p className="font-black text-sm text-primary">Data personalizada</p>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Escolha quando o plano começou ou começa.
                                </p>
                            </div>
                        </div>
                        <input
                            type="date"
                            value={customDate}
                            onChange={e => setCustomDate(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-black/5 text-sm font-bold focus:outline-none focus:border-secondary"
                        />
                        <button
                            onClick={() => activate("offset", customDate)}
                            disabled={!customDate}
                            className="w-full py-3 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest disabled:opacity-40 hover:bg-primary/90 active:scale-95 transition-all"
                        >
                            Usar esta data
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PlansPage() {
    const { profile, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const [switching, setSwitching] = useState<string | null>(null);
    const [show365Modal, setShow365Modal] = useState(false);

    const active365Config = typeof window !== "undefined" ? getPlan365Config() : null;

    const handleSelectPlan = async (planId: string) => {
        if (!profile) return;
        setSwitching(planId);
        try {
            const userRef = doc(db, "users", profile.uid);
            await updateDoc(userRef, {
                activePlanId: planId,
                planStartDate: serverTimestamp()
            });
            await refreshProfile();
            showToast(`Plano ${READING_PLANS.find(p => p.id === planId)?.name} ativado!`, "achievement");
            router.push("/");
        } catch (error) {
            console.error(error);
            showToast("Erro ao trocar de plano", "error");
        } finally {
            setSwitching(null);
        }
    };

    function handleDeactivate365() {
        clearPlan365Config();
        showToast("Plano 365 desativado", "success");
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-32">
            <header className="p-6 flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-black/5 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-black italic tracking-tighter">
                    Escolha seu <span className="text-secondary">Plano</span>
                </h1>
            </header>

            <main className="px-6 space-y-6 max-w-2xl mx-auto">
                <p className="text-sm text-[#455A80] font-medium leading-relaxed">
                    Selecione o plano que melhor se adapta ao seu ritmo. O progresso será reiniciado para o novo plano.
                </p>

                {/* ─── Bíblia em 1 Ano (365) ─── */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`p-6 rounded-[32px] border-2 transition-all relative overflow-hidden ${
                        active365Config
                            ? "border-amber-400 bg-white shadow-xl shadow-amber-400/10"
                            : "border-amber-200/60 bg-amber-50/40 hover:border-amber-300"
                    }`}
                >
                    {active365Config && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">
                            ATIVO
                        </div>
                    )}

                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            active365Config ? "bg-amber-100" : "bg-amber-100/60"
                        }`}>
                            <BookOpen className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="text-xl font-black italic tracking-tight">Bíblia em 1 Ano</h3>
                            <p className="text-sm text-[#455A80] font-medium leading-tight">
                                Toda a Bíblia em 365 dias — 3 a 5 capítulos diários, Gênesis ao Apocalipse.
                            </p>

                            {active365Config && (
                                <p className="text-xs text-amber-700 font-bold mt-1">
                                    Modo: {active365Config.mode === "calendar" ? "Calendário anual" : `Início em ${active365Config.startDate}`}
                                </p>
                            )}

                            <div className="flex items-center gap-4 pt-4 text-[10px] font-black uppercase tracking-widest text-[#455A80]/60">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    365 Dias
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Livre Escolha
                                </div>
                                <div className="flex items-center gap-1.5 text-amber-600">
                                    <Star className="w-3.5 h-3.5" />
                                    +30 XP bônus/dia
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-5">
                        <button
                            onClick={() => setShow365Modal(true)}
                            className="flex-1 py-4 rounded-2xl bg-amber-500 text-white font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-95"
                        >
                            {active365Config ? "Reconfigurar" : "Ativar Plano"}
                        </button>
                        {active365Config && (
                            <button
                                onClick={handleDeactivate365}
                                className="px-5 py-4 rounded-2xl border-2 border-black/10 text-xs font-black uppercase tracking-widest hover:bg-black/5 transition-all active:scale-95"
                            >
                                Pausar
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* ─── Other plans ─── */}
                <div className="grid gap-4">
                    {READING_PLANS.filter(p => p.id !== "bib1y").map((plan) => {
                        const isActive = profile?.activePlanId === plan.id;
                        return (
                            <motion.div
                                key={plan.id}
                                whileHover={{ scale: 1.01 }}
                                className={`p-6 rounded-[32px] border-2 transition-all relative overflow-hidden ${
                                    isActive
                                        ? "border-secondary bg-white shadow-xl shadow-secondary/10"
                                        : "border-black/5 bg-white/50 hover:border-black/10"
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">
                                        ATIVO
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                        isActive ? "bg-secondary/20" : "bg-black/5"
                                    }`}>
                                        <Book className={`w-6 h-6 ${isActive ? "text-secondary" : "text-black/40"}`} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="text-xl font-black italic tracking-tight">{plan.name}</h3>
                                        <p className="text-sm text-[#455A80] font-medium leading-tight">{plan.description}</p>

                                        <div className="flex items-center gap-4 pt-4 text-[10px] font-black uppercase tracking-widest text-[#455A80]/60">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {plan.durationDays} Dias
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {plan.type === "global" ? "Início Fixo" : "Livre Escolha"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!isActive && (
                                    <button
                                        onClick={() => handleSelectPlan(plan.id)}
                                        disabled={switching !== null}
                                        className="w-full mt-6 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95"
                                    >
                                        {switching === plan.id ? "Ativando..." : "ATIVAR ESTE PLANO"}
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </main>

            <MobileNav />

            <AnimatePresence>
                {show365Modal && <Plan365Modal onClose={() => setShow365Modal(false)} />}
            </AnimatePresence>
        </div>
    );
}
