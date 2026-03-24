"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getLevelTitle } from "@/lib/levels";

const CONFETTI = ["⭐", "✨", "🌟", "💫", "🏆", "🎉", "🎊", "👑", "💎", "🙌"];

function Confetti() {
    return (
        <>
            {Array.from({ length: 24 }, (_, i) => {
                const x = (Math.random() - 0.5) * 500;
                const y = -(150 + Math.random() * 400);
                const emoji = CONFETTI[i % CONFETTI.length];
                return (
                    <motion.span
                        key={i}
                        className="fixed text-xl pointer-events-none select-none z-[200]"
                        style={{ left: "50%", top: "50%" }}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
                        animate={{ opacity: 0, x, y, scale: [0, 1.3, 0.9], rotate: Math.random() * 720 - 360 }}
                        transition={{ duration: 1.5 + Math.random() * 0.8, delay: i * 0.04, ease: "easeOut" }}
                    >
                        {emoji}
                    </motion.span>
                );
            })}
        </>
    );
}

interface LevelUpModalProps {
    isOpen: boolean;
    level: number;
    onClose: () => void;
}

export function LevelUpModal({ isOpen, level, onClose }: LevelUpModalProps) {
    const title = getLevelTitle(level);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
                    <Confetti />

                    <motion.div
                        initial={{ scale: 0.4, opacity: 0, rotate: -5 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 22 }}
                        className="relative max-w-sm w-full rounded-3xl overflow-hidden text-center shadow-2xl"
                        style={{
                            background: "linear-gradient(145deg, #1A237E 0%, #0D1B6E 60%, #B8820A 100%)",
                            border: "2px solid rgba(184,130,10,0.5)",
                            boxShadow: "0 0 60px rgba(184,130,10,0.35), 0 0 120px rgba(26,35,126,0.4)",
                        }}
                    >
                        {/* Top shimmer */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />

                        <div className="p-8 space-y-5">
                            {/* Crown */}
                            <motion.div
                                animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="text-6xl leading-none"
                            >
                                👑
                            </motion.div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-secondary/80 uppercase tracking-[0.3em]">
                                    Subiu de Nível!
                                </p>
                                <motion.div
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="text-6xl font-black text-white italic tracking-tight"
                                    style={{ textShadow: "0 0 30px rgba(184,130,10,0.6)" }}
                                >
                                    {level}
                                </motion.div>
                                <p className="text-secondary font-black text-lg uppercase tracking-widest">
                                    {title}
                                </p>
                            </div>

                            <p className="text-white/60 text-sm leading-relaxed">
                                Você alcançou novos horizontes na sua jornada bíblica. Continue lendo!
                            </p>

                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={onClose}
                                className="w-full py-3.5 font-black rounded-2xl text-sm uppercase tracking-widest transition-all"
                                style={{
                                    background: "linear-gradient(135deg, #B8820A, #D4A430)",
                                    color: "#07091C",
                                    boxShadow: "0 4px 20px rgba(184,130,10,0.4)",
                                }}
                            >
                                Continuar Jornada →
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
