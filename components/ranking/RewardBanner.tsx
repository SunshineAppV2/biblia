"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Gem } from "lucide-react";

interface RewardBannerProps {
    activeTab: "level" | "encounter";
}

export function RewardBanner({ activeTab }: RewardBannerProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 rounded-[32px] bg-gradient-to-br from-[#0E1B5C] to-[#1A237E] text-white shadow-xl mb-8 border border-white/10 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-inner">
                        <Gem className="w-8 h-8 text-secondary animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/80">Recompensa</p>
                        <h3 className="text-xl font-black italic tracking-tighter">
                            {activeTab === "level" ? "Conquiste Gemas subindo de nível!" : "1º Lugar ganha 50 Gemas!"}
                        </h3>
                        <p className="text-[10px] opacity-60 font-medium mt-1">Sorteio acontece todo Domingo às 21:00.</p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
