"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelUpModalProps {
    isOpen: boolean;
    level: number;
    onClose: () => void;
}

export function LevelUpModal({ isOpen, level, onClose }: LevelUpModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="glass-card max-w-sm w-full p-8 text-center space-y-6 border-accent/50 shadow-[0_0_50px_rgba(245,158,11,0.3)]"
                    >
                        <div className="relative inline-block">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 -m-4 text-accent/20"
                            >
                                <Sparkles className="w-full h-full" />
                            </motion.div>

                            <div className="relative h-24 w-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Trophy className="w-12 h-12 text-white" />
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                            >
                                WOW!
                            </motion.div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">
                                Subiu de Nível!
                            </h2>
                            <p className="text-muted-foreground">
                                Você alcançou novos horizontes na sua jornada bíblica.
                            </p>
                        </div>

                        <div className="py-4">
                            <div className="text-5xl font-black bg-gradient-to-r from-accent to-white bg-clip-text text-transparent italic">
                                NÍVEL {level}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-accent text-accent-foreground font-black rounded-xl hover:opacity-90 transition-all transform active:scale-95 shadow-xl uppercase tracking-widest text-sm"
                        >
                            Continuar Jornada
                        </button>
                    </motion.div>

                    {/* Background particles simulation */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 0, x: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    y: [0, Math.random() * -300 - 100],
                                    x: [0, (Math.random() - 0.5) * 400]
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                                className="absolute left-1/2 top-1/2"
                            >
                                <Star className={cn("w-4 h-4 fill-accent text-accent", i % 2 === 0 ? "w-2 h-2" : "w-4 h-4")} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
