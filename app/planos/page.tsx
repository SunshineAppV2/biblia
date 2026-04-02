"use client";

import { useState, useEffect } from "react";
import { READING_PLANS } from "@/lib/reading-plan";
import { getPlan365Config, setPlan365Config, clearPlan365Config, todayISO, PLAN_365 } from "@/lib/reading-plan-365";
import { useAuth } from "@/components/AuthProvider";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/Toast";
import { MobileNav } from "@/components/MobileNav";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Check, Clock, Calendar, ArrowLeft, BookOpen, Star, X, ChevronRight, Sparkles, Play, Settings } from "lucide-react";
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

// ─── Active Plan Hero Card ────────────────────────────────────────────────────
function ActivePlanHero({
    icon,
    title,
    subtitle,
    badge,
    accentColor,
    bgGradient,
    glowColor,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    badge?: string;
    accentColor: string;
    bgGradient: string;
    glowColor: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-[28px] p-6 shadow-xl ${glowColor}`}
            style={{ background: bgGradient }}
        >
            {/* Animated glow orb */}
            <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl"
                style={{ backgroundColor: accentColor, opacity: 0.25 }}
            />

            {/* Active badge */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full border border-white/30">
                    <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-white"
                    />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        Plano Ativo
                    </span>
                    {badge && (
                        <span className="text-[10px] font-black text-white/70 ml-1">· {badge}</span>
                    )}
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 border border-white/30">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* Title */}
            <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 shadow-lg">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-black text-white tracking-tight leading-tight">{title}</h3>
                    <p className="text-sm text-white/70 font-medium mt-1 leading-snug">{subtitle}</p>
                </div>
            </div>

            {children}
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
    const [active365Config, setActive365Config] = useState<ReturnType<typeof getPlan365Config>>(null);

    useEffect(() => {
        setActive365Config(getPlan365Config());
    }, []);

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
        setActive365Config(null);
        showToast("Plano 365 desativado", "success");
    }

    const activePlanId = profile?.activePlanId || "rpsp";
    const activePlan = READING_PLANS.find(p => p.id === activePlanId);
    const otherPlans = READING_PLANS.filter(p => p.id !== "bib1y" && p.id !== activePlanId);
    const has365Active = !!active365Config;
    const hasAnyActive = has365Active || !!activePlan;

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-32">
            <header className="p-6 flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-black/5 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-black italic tracking-tighter">
                    Planos de <span className="text-secondary">Leitura</span>
                </h1>
            </header>

            <main className="px-6 space-y-8 max-w-2xl mx-auto">

                {/* ─── ACTIVE PLANS SECTION ─── */}
                {hasAnyActive && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-emerald-500"
                            />
                            <h2 className="text-xs font-black text-primary uppercase tracking-[0.25em]">
                                Seus Planos Ativos
                            </h2>
                        </div>

                        {/* Active 365 Plan */}
                        {has365Active && (
                            <ActivePlanHero
                                icon={<BookOpen className="w-7 h-7 text-white" />}
                                title="Bíblia em 1 Ano"
                                subtitle="Toda a Bíblia em 365 dias — 3 a 5 capítulos diários."
                                badge={active365Config!.mode === "calendar" ? "Calendário" : `Desde ${active365Config!.startDate}`}
                                accentColor="#f59e0b"
                                bgGradient="linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)"
                                glowColor="shadow-2xl shadow-amber-500/30"
                            >
                                <div className="flex items-center gap-3 pt-1 text-[10px] font-black text-white/60 uppercase tracking-widest mb-5">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        365 Dias
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-amber-300" />
                                        +30 XP bônus/dia
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push("/")}
                                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-amber-800 font-black text-xs uppercase tracking-widest hover:bg-amber-50 transition-all active:scale-95 shadow-md"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        Continuar Leitura
                                    </button>
                                    <button
                                        onClick={() => setShow365Modal(true)}
                                        className="px-4 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white font-black text-xs hover:bg-white/30 transition-all active:scale-95"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleDeactivate365}
                                        className="px-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white/70 font-black text-xs hover:bg-red-500/30 hover:text-white hover:border-red-300/40 transition-all active:scale-95"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </ActivePlanHero>
                        )}

                        {/* Active Regular Plan */}
                        {activePlan && (
                            <ActivePlanHero
                                icon={<Book className="w-7 h-7 text-white" />}
                                title={activePlan.name}
                                subtitle={activePlan.description}
                                accentColor="#1e3a8a"
                                bgGradient="linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)"
                                glowColor="shadow-2xl shadow-blue-500/30"
                            >
                                <div className="flex items-center gap-3 pt-1 text-[10px] font-black text-white/60 uppercase tracking-widest mb-5">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {activePlan.durationDays} Dias
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {activePlan.type === "global" ? "Início Fixo" : "Livre Escolha"}
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push("/")}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-blue-800 font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-md"
                                >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    Continuar Leitura
                                </button>
                            </ActivePlanHero>
                        )}
                    </section>
                )}

                {/* ─── DIVIDER ─── */}
                <div className="flex items-center gap-3 px-1">
                    <div className="flex-1 h-px bg-black/8" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        {hasAnyActive ? "Outros Planos" : "Escolha um Plano"}
                    </span>
                    <div className="flex-1 h-px bg-black/8" />
                </div>

                {!hasAnyActive && (
                    <p className="text-sm text-[#455A80] font-medium leading-relaxed -mt-4">
                        Selecione o plano que melhor se adapta ao seu ritmo.
                    </p>
                )}

                {/* ─── Bíblia em 1 Ano (365) — if NOT active ─── */}
                {!has365Active && (
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="p-6 rounded-[28px] border-2 border-amber-200/60 bg-amber-50/40 hover:border-amber-300 transition-all relative overflow-hidden"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100/60 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="text-xl font-black italic tracking-tight">Bíblia em 1 Ano</h3>
                                <p className="text-sm text-[#455A80] font-medium leading-tight">
                                    Toda a Bíblia em 365 dias — 3 a 5 capítulos diários, Gênesis ao Apocalipse.
                                </p>

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

                        <button
                            onClick={() => setShow365Modal(true)}
                            className="w-full mt-5 py-4 rounded-2xl bg-amber-500 text-white font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-95"
                        >
                            Ativar Plano
                        </button>
                    </motion.div>
                )}

                {/* ─── Other plans ─── */}
                <div className="grid gap-4">
                    {READING_PLANS.filter(p => p.id !== "bib1y" && p.id !== activePlanId).map((plan) => {
                        return (
                            <motion.div
                                key={plan.id}
                                whileHover={{ scale: 1.01 }}
                                className="p-6 rounded-[28px] border-2 border-black/5 bg-white/50 hover:border-black/10 transition-all relative overflow-hidden"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                                        <Book className="w-6 h-6 text-black/40" />
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

                                <button
                                    onClick={() => handleSelectPlan(plan.id)}
                                    disabled={switching !== null}
                                    className="w-full mt-6 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {switching === plan.id ? "Ativando..." : "ATIVAR ESTE PLANO"}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </main>

            <MobileNav />

            <AnimatePresence>
                {show365Modal && <Plan365Modal onClose={() => { setShow365Modal(false); setActive365Config(getPlan365Config()); }} />}
            </AnimatePresence>
        </div>
    );
}
