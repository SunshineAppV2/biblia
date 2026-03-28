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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.93 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: "var(--reading-bg)", border: "1px solid rgba(184,130,10,0.25)" }}
            >
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-secondary via-accent to-secondary" />

                {/* Header */}
                <div className="px-6 pt-7 pb-5 text-center space-y-3">
                    {/* Brain icon — dourado */}
                    <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ background: "linear-gradient(135deg, #B8820A, #D4A430)", boxShadow: "0 0 30px rgba(184,130,10,0.35)" }}>
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-foreground">Teste de Conhecimento!</h3>
                        <p className="text-sm text-cyan-500 font-bold mt-1 uppercase tracking-tighter">
                            Apenas sobre o que você acabou de ler:
                        </p>
                        <p className="font-black text-lg text-secondary mt-0.5">
                            {bookName} {chapter}
                        </p>
                    </div>
                </div>

                {/* XP info */}
                <div className="px-5 pb-4 space-y-3">
                    <div className="flex gap-3">
                        <div className="flex-1 rounded-2xl p-3 text-center"
                            style={{ background: "rgba(13,71,161,0.10)", border: "1px solid rgba(13,71,161,0.22)" }}>
                            <div className="font-black text-lg" style={{ color: "var(--accent)" }}>+30 XP</div>
                            <div className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "var(--accent)", opacity: 0.75 }}>por acerto</div>
                        </div>
                        <div className="flex-1 rounded-2xl p-3 text-center"
                            style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.22)" }}>
                            <div className="font-black text-lg text-red-500">−15 XP</div>
                            <div className="text-[10px] uppercase tracking-wide font-bold text-red-500/75">por erro</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-2xl p-3"
                        style={{ background: "rgba(184,130,10,0.10)", border: "1px solid rgba(184,130,10,0.22)" }}>
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--secondary)" }} />
                        <p className="text-xs leading-relaxed" style={{ color: "var(--secondary)" }}>
                            <strong>Atenção:</strong> respostas erradas <strong>descontam XP</strong> do seu total. Só aceite se leu com atenção!
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="px-5 pb-6 flex gap-3">
                    <button
                        onClick={onDecline}
                        className="flex-1 py-3 rounded-full text-sm font-bold transition-colors flex items-center justify-center gap-2"
                        style={{ border: "1px solid rgba(184,130,10,0.25)", color: "var(--muted-foreground)" }}
                    >
                        <X className="w-4 h-4" /> Dispensar
                    </button>
                    <button
                        onClick={onAccept}
                        className="flex-1 py-3 rounded-full text-sm font-black transition-all flex items-center justify-center gap-2 text-white"
                        style={{
                            background: "linear-gradient(135deg, #B8820A 0%, #D4A430 50%, #B8820A 100%)",
                            boxShadow: "0 4px 20px rgba(184,130,10,0.45)",
                        }}
                    >
                        <Zap className="w-4 h-4 fill-current" /> Aceitar!
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
