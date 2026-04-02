"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Star, BookOpen, ArrowRight, Home } from "lucide-react";
import { SessionChapter } from "@/lib/plan-session";

interface DayCompletedModalProps {
    isOpen: boolean;
    /**  List of chapters completed in this session */
    chapters: SessionChapter[];
    /** XP earned for plan completion bonus */
    bonusXp?: number;
    onContinue: () => void;   // Go to dashboard / home
}

// Simple confetti particle component
function Confetti() {
    const particles = Array.from({ length: 18 }, (_, i) => i);
    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ec4899", "#1e3a8a"];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map(i => (
                <motion.div
                    key={i}
                    initial={{
                        x: `${Math.random() * 100}%`,
                        y: "-10%",
                        rotate: 0,
                        opacity: 1,
                        scale: Math.random() * 0.6 + 0.4,
                    }}
                    animate={{
                        y: "110%",
                        rotate: Math.random() * 720 - 360,
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 1.5 + 1.2,
                        delay: Math.random() * 0.5,
                        ease: "easeIn",
                    }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{ backgroundColor: colors[i % colors.length] }}
                />
            ))}
        </div>
    );
}

export function DayCompletedModal({
    isOpen,
    chapters,
    bonusXp = 30,
    onContinue,
}: DayCompletedModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 260 }}
                        className="relative w-full max-w-sm bg-white rounded-[36px] overflow-hidden shadow-2xl"
                    >
                        <Confetti />

                        {/* Header gradient */}
                        <div
                            className="relative px-8 pt-10 pb-6 text-center"
                            style={{
                                background: "linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 60%, #065f46 100%)",
                            }}
                        >
                            {/* Pulsing checkmark */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 18 }}
                                className="w-24 h-24 mx-auto rounded-full bg-white/15 border-4 border-white/30 flex items-center justify-center mb-4 shadow-xl"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.12, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <CheckCircle className="w-12 h-12 text-emerald-300" />
                                </motion.div>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="text-3xl font-black text-white tracking-tight leading-tight"
                            >
                                Plano do Dia<br />
                                <span className="text-emerald-300">Concluído!</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.35 }}
                                className="text-white/70 text-sm font-medium mt-2"
                            >
                                Você leu todos os capítulos de hoje 🎉
                            </motion.p>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-4">
                            {/* Bonus XP pill */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center justify-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl px-5 py-3"
                            >
                                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                                <span className="text-amber-800 font-black text-sm">
                                    +{bonusXp} XP Bônus do Plano!
                                </span>
                                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                            </motion.div>

                            {/* Chapters completed list */}
                            {chapters.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-1.5"
                                >
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 mb-2">
                                        Capítulos lidos hoje
                                    </p>
                                    {chapters.map((ch, i) => (
                                        <motion.div
                                            key={`${ch.bookId}_${ch.chapter}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + i * 0.06 }}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span className="text-sm font-bold text-emerald-800 capitalize flex-1">
                                                {ch.bookName} {ch.chapter}
                                            </span>
                                            <BookOpen className="w-3 h-3 text-emerald-400" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {/* CTA button */}
                            <motion.button
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + chapters.length * 0.06 }}
                                onClick={onContinue}
                                whileTap={{ scale: 0.96 }}
                                className="w-full py-4 rounded-2xl font-black text-white text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:opacity-90 transition-all"
                                style={{
                                    background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
                                }}
                            >
                                <Home className="w-4 h-4" />
                                Voltar ao Início
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
