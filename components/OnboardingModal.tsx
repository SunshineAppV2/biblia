"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Trophy, Zap, Flame, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "biblequest_onboarded";

const STEPS = [
    {
        icon: <BookOpen className="w-12 h-12 text-secondary" />,
        title: "Bem-vindo ao BibleQuest",
        description: "Leia a Bíblia inteira de forma gamificada. Cada capítulo lido é um passo na sua jornada espiritual.",
        highlight: "1.189 capítulos para explorar",
        color: "from-secondary/20 to-accent/10",
    },
    {
        icon: <Trophy className="w-12 h-12 text-accent" />,
        title: "Ganhe XP e Suba de Nível",
        description: "Cada capítulo lido te dá +50 XP. Suba pelos 66 níveis — um para cada livro da Bíblia.",
        highlight: "66 níveis — do Iniciante ao Guardião da Palavra",
        color: "from-accent/20 to-primary/10",
    },
    {
        icon: <Zap className="w-12 h-12 text-secondary" />,
        title: "Quiz Opcional após a Leitura",
        description: "Após cada capítulo, você pode responder 3 perguntas. Acerte e ganhe +30 XP por questão. Erre e perca -15 XP.",
        highlight: "Quiz é opcional — você decide se arrisca!",
        color: "from-secondary/20 to-red-300/10",
    },
    {
        icon: <Flame className="w-12 h-12 text-red-400" />,
        title: "Mantenha sua Ofensiva",
        description: "Leia pelo menos um capítulo por dia para manter sua sequência. Quanto mais dias seguidos, maior sua posição no ranking semanal.",
        highlight: "Não quebre sua ofensiva!",
        color: "from-red-300/20 to-secondary/10",
    },
    {
        icon: <Star className="w-12 h-12 text-secondary" />,
        title: "Conquistas e Ligas",
        description: "Desbloqueie conquistas especiais e compita em ligas semanais com outros leitores. Os melhores são promovidos!",
        highlight: "Comece agora e escreva sua história",
        color: "from-secondary/20 to-primary/10",
    },
];

export function OnboardingModal() {
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const done = localStorage.getItem(STORAGE_KEY);
        if (!done) setShow(true);
    }, []);

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, "1");
        setShow(false);
    };

    const current = STEPS[step];

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={handleClose} />

                    {/* Modal */}
                    <motion.div
                        key={step}
                        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-secondary/20"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {/* Gradient top */}
                        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-accent")} />

                        {/* Content */}
                        <div className={cn("p-8 bg-gradient-to-br", current.color)}>
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 rounded-3xl bg-white/80 border border-secondary/20 flex items-center justify-center shadow-lg">
                                    {current.icon}
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-primary text-center mb-3 leading-tight">
                                {current.title}
                            </h2>

                            <p className="text-muted-foreground text-center leading-relaxed mb-4">
                                {current.description}
                            </p>

                            <div className="bg-secondary/15 border border-secondary/30 rounded-xl px-4 py-2.5 text-center">
                                <p className="text-sm font-bold text-secondary">{current.highlight}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 pb-8 pt-4 bg-white">
                            {/* Dots */}
                            <div className="flex justify-center gap-1.5 mb-5">
                                {STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all duration-300",
                                            i === step ? "w-6 bg-secondary" : "w-1.5 bg-primary/20"
                                        )}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full py-3.5 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                            >
                                {step < STEPS.length - 1 ? (
                                    <>Próximo <ChevronRight className="w-4 h-4" /></>
                                ) : (
                                    <>Começar Jornada ✨</>
                                )}
                            </button>

                            {step < STEPS.length - 1 && (
                                <button
                                    onClick={handleClose}
                                    className="w-full mt-2 py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Pular introdução
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
