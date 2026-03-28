"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Gem, ArrowLeft, Check, X, Timer, Users, BookOpen, Lock } from "lucide-react";
import Link from "next/link";
import { addUserXp } from "@/lib/firestore";
import { trackArenaWin } from "@/components/DailyMissions";
import { completeMissionXP } from "@/lib/progress";
import { useToast } from "@/components/Toast";
import { MobileNav } from "@/components/MobileNav";
import { READING_PLANS } from "@/lib/reading-plan";
import { cn } from "@/lib/utils";

const PLAN_QUESTIONS: Record<string, any[]> = {
    rpsp: [
        { q: "¿Qual o tema central do capítulo de hoje no RPSP?", a: ["Arrependimento", "Criação", "Justiça", "Amor"], correct: 0 },
        { q: "¿Quem é o personagem principal desta semana?", a: ["Moisés", "Jesus", "Paulo", "Davi"], correct: 1 },
    ],
    nt_3_meses: [
        { q: "¿Qual milagre de Jesus lemos esta semana?", a: ["Cura do cego", "Lázaro", "Pães e peixes", "Andar sobre o mar"], correct: 2 },
    ],
    bíblia_1_ano: [
        { q: "¿Em qual livro estamos lendo esta semana?", a: ["Gênesis", "Mateus", "Salmos", "Atos"], correct: 0 },
    ]
};

export default function ArenaPage() {
    const { profile, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const [gameState, setGameState] = useState<"lobby" | "searching" | "playing" | "result">("lobby");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [opponentName, setOpponentName] = useState("");
    const [activeQuestions, setActiveQuestions] = useState<any[]>([]);

    const getQuestionsByPlan = () => {
        const planId = profile?.activePlanId || "rpsp";
        return PLAN_QUESTIONS[planId] || PLAN_QUESTIONS.rpsp;
    };

    const userLevel = Math.floor((profile?.xp || 0) / 1000);
    const isLocked = userLevel < 10;

    const startSearch = () => {
        if (isLocked) return;
        setActiveQuestions(getQuestionsByPlan());
        setGameState("searching");
        const opponents = ["Calebe77", "Debora_B", "Samuel_Vip", "Ester_Rainha"];
        setOpponentName(opponents[Math.floor(Math.random() * opponents.length)]);
        
        setTimeout(() => {
            setGameState("playing");
            setCurrentQuestion(0);
            setScore(0);
            setOpponentScore(0);
            setTimeLeft(15);
        }, 2000);
    };

    useEffect(() => {
        if (gameState === "playing" && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (gameState === "playing" && timeLeft === 0) {
            handleAnswer(-1); // timeout
        }
    }, [gameState, timeLeft]);

    const handleAnswer = (index: number) => {
        const isCorrect = index === activeQuestions[currentQuestion].correct;
        if (isCorrect) setScore(prev => prev + (timeLeft * 5));
        
        // Simular oponente
        if (Math.random() > 0.3) setOpponentScore(prev => prev + (Math.floor(Math.random() * 10) * 5));

        if (currentQuestion < activeQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setTimeLeft(15);
        } else {
            finishGame();
        }
    };

    const finishGame = async () => {
        setGameState("result");
        if (score >= opponentScore && profile) {
            await addUserXp(profile.uid, 40);
            const bonus = trackArenaWin();
            if (bonus > 0) await completeMissionXP(profile.uid, bonus);
            showToast("VITÓRIA NO BOM DE BÍBLIA!", "achievement");
            await refreshProfile();
        }
    };

    const activePlan = READING_PLANS.find(p => p.id === (profile?.activePlanId || "rpsp"));

    return (
        <div className="min-h-screen bg-[#050B2C] text-white pb-32">
            <header className="p-6 flex items-center justify-between glass sticky top-0 z-50 border-b border-white/5">
                <Link href="/" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="text-center">
                    <h1 className="text-xl font-black italic tracking-tighter uppercase">BOM DE <span className="text-secondary">BÍBLIA+</span></h1>
                    <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest italic">Duelos do Plano</p>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-white/10">
                    <Trophy className="w-5 h-5 text-secondary" />
                </div>
            </header>

            <main className="p-6 max-w-lg mx-auto">
                <AnimatePresence mode="wait">
                    {gameState === "lobby" && (
                        <motion.div 
                            key="lobby"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8 pt-10"
                        >
                            <div className="bg-white/5 backdrop-blur-3xl p-10 text-center space-y-8 rounded-[48px] border border-white/10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                {isLocked && (
                                    <div className="absolute inset-0 bg-[#0E1B5C]/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center">
                                        <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mb-6 border border-white/20 shadow-2xl">
                                            <Lock className="w-10 h-10 text-secondary" />
                                        </div>
                                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Arena Trancada</h2>
                                        <p className="text-white/60 text-sm mt-2 font-medium">
                                            Alcance o <span className="text-secondary font-black">Nível 10</span> para enfrentar rivais nesta arena épica!
                                        </p>
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full -ml-24 -mb-24 blur-3xl" />
                                
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-28 h-28 bg-[#0E1B5C] rounded-[40px] mx-auto flex items-center justify-center border-4 border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                >
                                    <BookOpen className="w-14 h-14 text-secondary" />
                                </motion.div>
                                <div className="space-y-3 relative z-10">
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Duelo da <span className="text-secondary">Semana</span></h2>
                                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">
                                        Baseado no plano:<br/>
                                        <span className="text-white">{activePlan?.name}</span>
                                    </p>
                                </div>
                                <button 
                                    onClick={startSearch}
                                    disabled={isLocked}
                                    className="w-full bg-secondary hover:bg-secondary/90 disabled:bg-white/5 text-primary font-black py-6 rounded-3xl shadow-[0_15px_30px_rgba(184,130,10,0.3)] transition-all flex items-center justify-center gap-4 active:scale-95 text-lg uppercase italic tracking-tighter"
                                >
                                    <Zap className="w-7 h-7 fill-current" />
                                    {isLocked ? "ARENA BLOQUEADA" : "ENCONTRAR RIVAL"}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 border border-white/10 p-6 rounded-[32px] text-center shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
                                    <p className="text-[10px] font-black uppercase text-white/40 mb-1 tracking-[0.2em]">Duelos Hoje</p>
                                    <p className="text-3xl font-black italic tracking-tighter">5</p>
                                </div>
                                <div className="bg-white/10 border border-white/10 p-6 rounded-[32px] text-center shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-secondary/20" />
                                    <p className="text-[10px] font-black uppercase text-white/40 mb-1 tracking-[0.2em]">Taxa de Vitória</p>
                                    <p className="text-3xl font-black italic tracking-tighter text-secondary">80%</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {gameState === "searching" && (
                        <motion.div 
                            key="searching"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center min-h-[50vh] gap-12"
                        >
                            <div className="relative">
                                <motion.div 
                                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                                    transition={{ rotate: { repeat: Infinity, duration: 4, ease: "linear" }, scale: { repeat: Infinity, duration: 2 } }}
                                    className="w-56 h-56 border-2 border-dashed border-primary/30 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-28 h-28 bg-[#050B2C] rounded-full border-4 border-primary shadow-[0_0_40px_rgba(59,130,246,0.2)] flex items-center justify-center overflow-hidden">
                                        <Users className="w-10 h-10 text-primary/40"/>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-3xl font-black italic animate-pulse tracking-tight uppercase">Buscando Rival...</h3>
                                <p className="text-white/20 text-xs font-bold uppercase tracking-widest">{activePlan?.name}</p>
                            </div>
                        </motion.div>
                    )}

                    {gameState === "playing" && (
                        <motion.div 
                            key="playing"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 bg-white/5 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="text-[10px] font-black uppercase opacity-40">VOCÊ</div>
                                    <div className="font-black text-2xl text-primary">{score}</div>
                                </div>
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center font-black text-2xl shadow-xl border-2 border-white/20">
                                    {timeLeft}
                                </div>
                                <div className="flex-1 bg-white/5 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="font-black text-2xl text-red-400">{opponentScore}</div>
                                    <div className="text-[10px] font-black uppercase opacity-40">{opponentName}</div>
                                </div>
                            </div>

                            <div className="glass-card p-10 text-center space-y-10 min-h-[400px] flex flex-col justify-center">
                                <div className="space-y-4">
                                    <p className="text-primary font-black uppercase text-[10px] tracking-[0.3em]">Pergunta {currentQuestion + 1} de {activeQuestions.length}</p>
                                    <h3 className="text-2xl font-black italic tracking-tight leading-snug">
                                        {activeQuestions[currentQuestion].q}
                                    </h3>
                                </div>
                                
                                <div className="grid gap-4">
                                    {activeQuestions[currentQuestion].a.map((opt: string, i: number) => (
                                        <button 
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            className="w-full bg-white/5 hover:bg-primary border border-white/10 p-5 rounded-2xl text-sm font-bold transition-all text-left flex items-center justify-between group"
                                        >
                                            {opt}
                                            <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:bg-white/20 flex items-center justify-center p-1">
                                                <div className="w-full h-full bg-white/10 rounded-full" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {gameState === "result" && (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8 pt-10"
                        >
                            <div className={cn(
                                "w-32 h-32 rounded-[40px] bg-gradient-to-br mx-auto flex items-center justify-center shadow-2xl",
                                score >= opponentScore ? "from-secondary to-yellow-600" : "from-red-600 to-red-900"
                            )}>
                                {score >= opponentScore ? <Trophy className="w-16 h-16 text-white" /> : <X className="w-16 h-16 text-white" />}
                            </div>
                            
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                                    {score >= opponentScore ? "DOMINOU!" : "RIVAL VENCEU"}
                                </h2>
                                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                                    {score >= opponentScore ? `Você venceu ${opponentName}!` : `Você perdeu para ${opponentName}`}
                                </p>
                            </div>

                            <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                                <div className="flex justify-around items-center">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-white/30 uppercase mb-2">Seus Pontos</p>
                                        <p className="text-4xl font-black text-primary">{score}</p>
                                    </div>
                                    <div className="h-10 w-px bg-white/10" />
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-white/30 uppercase mb-2">{opponentName}</p>
                                        <p className="text-4xl font-black text-red-400">{opponentScore}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setGameState("lobby")}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-5 rounded-3xl border border-white/10 transition-all uppercase tracking-widest"
                                >
                                    VOLTAR
                                </button>
                                <button 
                                    onClick={startSearch}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-3xl shadow-xl shadow-primary/20 transition-all uppercase tracking-widest"
                                >
                                    NOVO DUELO
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <MobileNav />
        </div>
    );
}
