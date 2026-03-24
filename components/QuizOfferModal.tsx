"use client";

import { motion } from "framer-motion";
import { Brain, AlertTriangle, Zap, X } from "lucide-react";

interface QuizOfferModalProps {
    isOpen: boolean;
    bookName: string;
    chapter: number;
    onAccept: () => void;
    onDecline: () => void;
}

export function QuizOfferModal({ isOpen, bookName, chapter, onAccept, onDecline }: QuizOfferModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="glass-card w-full max-w-sm overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 pb-4 text-center space-y-3 border-b border-white/10">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                        <Brain className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white">Quiz Disponível!</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {bookName} {chapter} — 3 perguntas
                        </p>
                    </div>
                </div>

                {/* XP info */}
                <div className="p-5 space-y-3">
                    <div className="flex gap-3">
                        <div className="flex-1 rounded-xl bg-accent/10 border border-accent/20 p-3 text-center">
                            <div className="text-accent font-black text-lg">+30 XP</div>
                            <div className="text-[10px] text-accent/70 uppercase tracking-wide font-bold">por acerto</div>
                        </div>
                        <div className="flex-1 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-center">
                            <div className="text-red-400 font-black text-lg">−15 XP</div>
                            <div className="text-[10px] text-red-500/80 uppercase tracking-wide font-bold">por erro</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 bg-secondary/10 border border-secondary/20 rounded-xl p-3">
                        <AlertTriangle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <p className="text-xs text-secondary/80 leading-relaxed">
                            <strong className="text-secondary">Atenção:</strong> respostas erradas <strong>descontam XP</strong> do seu total. Só aceite se leu com atenção!
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="px-5 pb-5 flex gap-3">
                    <button
                        onClick={onDecline}
                        className="flex-1 py-3 rounded-full border border-secondary/20 text-muted-foreground text-sm font-bold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" /> Dispensar
                    </button>
                    <button
                        onClick={onAccept}
                        className="flex-1 py-3 rounded-full bg-primary text-white text-sm font-black hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    >
                        <Zap className="w-4 h-4 fill-current" /> Aceitar!
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
