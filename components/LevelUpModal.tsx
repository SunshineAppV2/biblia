"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Shield, ArrowUp, Zap } from "lucide-react";

export function LevelUpModal({ isOpen, level, onClose }: { isOpen: boolean; level: number; onClose: () => void }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ scale: 0.5, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, y: 20, opacity: 0 }}
                        className="relative w-full max-w-sm rounded-3xl p-8 text-center overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #1A237E 0%, #0D1754 100%)" }}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            {/* Animated Level Badge */}
                            <motion.div
                                initial={{ rotate: -15, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", damping: 10, delay: 0.2 }}
                                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-accent to-yellow-300 flex items-center justify-center shadow-2xl shadow-accent/40"
                            >
                                <span className="text-4xl font-black text-white">{level}</span>
                            </motion.div>

                            <div className="space-y-2 text-white">
                                <motion.p
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-accent font-black uppercase tracking-[0.2em] text-xs"
                                >
                                    Novo Nível Desbloqueado
                                </motion.p>
                                <motion.h2
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-4xl font-black"
                                >
                                    {level === 2 ? "Iniciante!" : "Incrível!"}
                                </motion.h2>
                                <motion.p
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-primary-foreground/70 font-medium"
                                >
                                    Sua jornada bíblica está crescendo. Continue assim para chegar à liga diamante!
                                </motion.p>
                            </div>

                            {/* Reward Simulation */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="p-4 rounded-2xl bg-white/10 border border-white/5 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                       <Zap className="w-6 h-6 text-accent fill-current" />
                                    </div>
                                    <div className="text-left">
                                       <p className="text-[10px] font-black uppercase text-white/50">Recompensa</p>
                                       <p className="text-sm font-bold text-white">Bônus de Nível</p>
                                    </div>
                                </div>
                                <span className="text-xl font-black text-accent">+10 XP</span>
                            </motion.div>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="w-full py-4 rounded-2xl bg-white text-primary font-black uppercase tracking-widest shadow-xl shadow-white/10 transition-all hover:bg-slate-50"
                            >
                                Continuar
                            </motion.button>
                        </div>

                        {/* Particle burst simulation using svg/motion */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: "50%", y: "50%", opacity: 0 }}
                                    animate={{ 
                                        x: `${50 + (Math.cos(i) * 60)}%`, 
                                        y: `${50 + (Math.sin(i) * 60)}%`, 
                                        opacity: [0, 1, 0] 
                                    }}
                                    transition={{ duration: 0.8, delay: 0.3, repeat: Infinity, repeatDelay: 2 }}
                                    className="absolute w-2 h-2 rounded-full bg-accent"
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
