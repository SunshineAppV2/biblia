"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Gem, ArrowLeft, Check, X, Timer, Users } from "lucide-react";
import Link from "next/link";
import { addUserXp } from "@/lib/firestore";
import { trackArenaWin } from "@/components/DailyMissions";
import { completeMissionXP } from "@/lib/progress";
import { useToast } from "@/components/Toast";
import { MobileNav } from "@/components/MobileNav";

const ARENA_QUESTIONS = [
    { q: "¿Quem construiu a arca?", a: ["Noé", "Moisés", "Davi", "Pedro"], correct: 0 },
    { q: "¿Quantos discípulos Jesus tinha?", a: ["10", "12", "7", "40"], correct: 1 },
    { q: "¿Qual o primeiro livro da Bíblia?", a: ["Êxodo", "Mateus", "Gênesis", "Salmos"], correct: 2 },
    { q: "¿Quem derrotou Golias?", a: ["Saul", "Davi", "Salomão", "Sansão"], correct: 1 },
    { q: "¿Jesus nasceu em qual cidade?", a: ["Jerusalém", "Nazaré", "Belém", "Roma"], correct: 2 },
];

export default function ArenaPage() {
    const { profile, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const [gameState, setGameState] = useState<"lobby" | "searching" | "playing" | "result">("lobby");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [opponentName, setOpponentName] = useState("");

    const startSearch = () => {
        setGameState("searching");
        // Simulated matchmaking
        const opponents = ["Calebe77", "Debora_B", "Samuel_Vip", "Ester_Rainha"];
        setOpponentName(opponents[Math.floor(Math.random() * opponents.length)]);
        
        setTimeout(() => {
            setGameState("playing");
            setCurrentQuestion(0);
            setScore(0);
            setOpponentScore(0);
            setTimeLeft(10);
        }, 3000);
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
        const isCorrect = index === ARENA_QUESTIONS[currentQuestion].correct;
        if (isCorrect) setScore(prev => prev + (timeLeft * 10));
        
        // Simular oponente
        if (Math.random() > 0.4) setOpponentScore(prev => prev + (Math.floor(Math.random() * 8) * 10));

        if (currentQuestion < ARENA_QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setTimeLeft(10);
        } else {
            finishGame();
        }
    };

    const finishGame = async () => {
        setGameState("result");
        if (score >= opponentScore && profile) {
            await addUserXp(profile.uid, 50);
            
            // Missão de Vitória na Arena
            const bonus = trackArenaWin();
            if (bonus > 0) {
                await completeMissionXP(profile.uid, bonus);
                showToast(`VITÓRIA! +50 XP e +${bonus} XP de Missão!`, "achievement");
            } else {
                showToast("VITÓRIA! +50 XP", "achievement");
            }
            
            await refreshProfile();
        }
    };

    return (
        <div className="min-h-screen bg-[#0E1B5C] text-white pb-32">
            <header className="p-6 flex items-center justify-between glass sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="text-center">
                    <h1 className="text-xl font-black italic tracking-tighter">BOM DE <span className="text-secondary">BÍBLIA</span></h1>
                    <p className="text-[10px] uppercase font-bold text-white/40">Arena de Desafios</p>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <Gem className="w-3.5 h-3.5 text-blue-400 fill-current" />
                    <span className="text-xs font-black">{profile?.gems || 0}</span>
                </div>
            </header>

            <main className="p-6 max-w-lg mx-auto">
                <AnimatePresence mode="wait">
                    {gameState === "lobby" && (
                        <motion.div 
                            key="lobby"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="space-y-8 text-center pt-10"
                        >
                            <div className="relative inline-block">
                                <div className="w-32 h-32 bg-secondary/20 rounded-[40px] flex items-center justify-center border-4 border-secondary/40 shadow-[0_0_50px_rgba(184,130,10,0.3)]">
                                    <Trophy className="w-16 h-16 text-secondary" />
                                </div>
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1] }} 
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute -top-2 -right-2 bg-red-500 p-2 rounded-full shadow-lg"
                                >
                                    <Zap className="w-4 h-4 fill-white" />
                                </motion.div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-black italic">PRONTO PARA O DUELO?</h2>
                                <p className="text-white/60 text-sm">Desafie outros leitores do seu nível e ganhe prêmios exclusivos.</p>
                            </div>

                            <button 
                                onClick={startSearch}
                                className="w-full bg-secondary hover:bg-secondary/90 text-white font-black py-5 rounded-3xl shadow-xl shadow-secondary/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Users className="w-6 h-6" />
                                ENCONTRAR OPONENTE
                            </button>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="bg-white/5 border border-white/10 p-4 rounded-3xl">
                                    <p className="text-[10px] font-black uppercase text-white/40">Suas Vitórias</p>
                                    <p className="text-2xl font-black">12</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-3xl">
                                    <p className="text-[10px] font-black uppercase text-white/40">XP Ganho</p>
                                    <p className="text-2xl font-black">600</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {gameState === "searching" && (
                        <motion.div 
                            key="searching"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center min-h-[60vh] gap-12"
                        >
                            <div className="relative">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                    className="w-48 h-48 border-4 border-dashed border-secondary/40 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-primary rounded-full border-4 border-white/10 flex items-center justify-center overflow-hidden">
                                        {profile?.photoURL ? <img src={profile.photoURL} alt="Me" /> : <Users className="w-8 h-8"/>}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black italic animate-pulse">PROCURANDO OPONENTE...</h3>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Nível: {profile?.xp ? Math.floor(profile.xp/1000) : 1}</p>
                            </div>
                        </motion.div>
                    )}

                    {gameState === "playing" && (
                        <motion.div 
                            key="playing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            {/* Score info */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 bg-white/10 p-3 rounded-2xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-xl shrink-0 overflow-hidden text-[10px] flex items-center justify-center">VOCÊ</div>
                                    <div className="flex-1 text-center font-black text-xl">{score}</div>
                                </div>
                                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-[#0E1B5C]">
                                    {timeLeft}
                                </div>
                                <div className="flex-1 bg-white/10 p-3 rounded-2xl flex items-center gap-3">
                                    <div className="flex-1 text-center font-black text-xl">{opponentScore}</div>
                                    <div className="w-10 h-10 bg-red-900 rounded-xl shrink-0 flex items-center justify-center text-[8px] font-black uppercase text-center">{opponentName}</div>
                                </div>
                            </div>

                            {/* Question Card */}
                            <div className="bg-white rounded-[40px] p-8 text-black shadow-2xl space-y-8 min-h-[400px] flex flex-col justify-center text-center">
                                <p className="text-secondary font-black uppercase text-[10px] tracking-widest">Pergunta {currentQuestion + 1} de 5</p>
                                <h3 className="text-2xl font-black italic tracking-tight">{ARENA_QUESTIONS[currentQuestion].q}</h3>
                                
                                <div className="grid gap-3 pt-4">
                                    {ARENA_QUESTIONS[currentQuestion].a.map((opt, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            className="w-full bg-[#F5F7FA] hover:bg-secondary hover:text-white border-2 border-black/5 p-4 rounded-2xl text-sm font-bold transition-all text-left flex items-center justify-between group"
                                        >
                                            {opt}
                                            <div className="w-6 h-6 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Check className="w-3 h-3" />
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
                            <div className="text-7xl mb-4">{score >= opponentScore ? "🏆" : "😔"}</div>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                                {score >= opponentScore ? "VOCÊ VENCEU!" : "NÃO FOI DESSA VEZ"}
                            </h2>
                            <div className="bg-white/10 p-6 rounded-[40px] border border-white/20">
                                <div className="flex justify-around items-center">
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase">Seu Score</p>
                                        <p className="text-4xl font-black text-white">{score}</p>
                                    </div>
                                    <div className="h-12 w-px bg-white/20" />
                                    <div>
                                        <p className="text-[10px] font-black text-red-400 uppercase">{opponentName}</p>
                                        <p className="text-4xl font-black text-red-400">{opponentScore}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setGameState("lobby")}
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-3xl border border-white/20 transition-all"
                                >
                                    VOLTAR
                                </button>
                                <button 
                                    onClick={startSearch}
                                    className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-black py-4 rounded-3xl shadow-xl shadow-secondary/20 transition-all"
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
