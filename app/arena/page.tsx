"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Gem, ArrowLeft, Check, X, Timer, Users, BookOpen, Lock } from "lucide-react";
import Link from "next/link";
import { joinArenaQueue, leaveArenaQueue, findRivalInQueue, createArenaMatch, updateMatchScore, finishArenaMatch, ArenaMatch, addUserXp } from "@/lib/firestore";
import { trackArenaWin } from "@/components/DailyMissions";
import { completeMissionXP } from "@/lib/progress";
import { useToast } from "@/components/Toast";
import { MobileNav } from "@/components/MobileNav";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
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
    const [matchId, setMatchId] = useState<string | null>(null);
    const [searchingTimeout, setSearchingTimeout] = useState(false);

    const getQuestionsByPlan = () => {
        const planId = profile?.activePlanId || "rpsp";
        return PLAN_QUESTIONS[planId] || PLAN_QUESTIONS.rpsp;
    };

    const userLevel = Math.floor((profile?.xp || 0) / 1000);
    const isLocked = userLevel < 10;

    // Listen for matches
    useEffect(() => {
        if (gameState !== "searching" || !profile) return;

        // Deterministic check: we only need to "find" someone else.
        // If they find us, they create the match.
        const interval = setInterval(async () => {
            try {
                const rival = await findRivalInQueue(profile.uid, userLevel);
                if (rival) {
                    const id = await createArenaMatch(
                        { uid: profile.uid, name: profile.displayName || "Você" },
                        { uid: rival.uid, name: rival.name }
                    );
                    setMatchId(id);
                }
            } catch (e) {
                console.error("Erro na busca:", e);
            }
        }, 3000);

        // Global check for any match involving me
        // (This catches when the oponent creates the match)
        // For simplicity, we just use the deterministic match check above.
        // But let's add a timeout
        const timeout = setTimeout(() => {
            if (gameState === "searching" && !matchId) {
                leaveArenaQueue(profile.uid);
                setSearchingTimeout(true);
                setGameState("lobby");
            }
        }, 20000); // 20 seconds

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [gameState, profile]);

    // Handle Match Found
    useEffect(() => {
        if (!matchId || !profile) return;

        const unsubscribe = onSnapshot(doc(db, "arena_matches", matchId), (snap) => {
            const data = snap.data() as ArenaMatch;
            if (!data) return;

            // Sync scores
            const opponentUid = data.players.find(p => p !== profile.uid);
            if (opponentUid) {
                setOpponentScore(data.scores[opponentUid] || 0);
                setOpponentName(data.playerNames[opponentUid] || "Companheiro");
            }

            if (gameState === "searching") {
                setActiveQuestions(getQuestionsByPlan());
                setGameState("playing");
                setCurrentQuestion(0);
                setScore(0);
                setTimeLeft(15);
            }
        });

        return () => unsubscribe();
    }, [matchId, profile]);

    const startSearch = async () => {
        if (isLocked || !profile) return;
        setSearchingTimeout(false);
        setMatchId(null);
        setGameState("searching");
        await joinArenaQueue(profile as any, userLevel);
    };

    useEffect(() => {
        if (gameState === "playing" && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (gameState === "playing" && timeLeft === 0) {
            handleAnswer(-1); // timeout
        }
    }, [gameState, timeLeft]);

    const handleAnswer = async (index: number) => {
        const isCorrect = index === activeQuestions[currentQuestion].correct;
        const newScore = isCorrect ? score + (timeLeft * 5) : score;
        if (isCorrect) setScore(newScore);
        
        // Sincronizar placar real
        if (matchId && profile) {
            await updateMatchScore(matchId, profile.uid, newScore);
        }

        if (currentQuestion < activeQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setTimeLeft(15);
        } else {
            finishGame(newScore);
        }
    };

    const finishGame = async (currentScore?: number) => {
        const finalScore = currentScore !== undefined ? currentScore : score;
        setGameState("result");
        if (matchId) await finishArenaMatch(matchId);
        
        if (finalScore >= opponentScore && profile) {
            await addUserXp(profile.uid, 40);
            const bonus = trackArenaWin();
            if (bonus > 0) await completeMissionXP(profile.uid, bonus);
            showToast("CONQUISTA NO BOM DE BÍBLIA!", "achievement");
            await refreshProfile();
        }
    };

    const activePlan = READING_PLANS.find(p => p.id === (profile?.activePlanId || "rpsp"));

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#1A237E_0%,_#050B2C_100%)] text-white pb-32 selection:bg-secondary/30">
            <header className="p-6 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <Link href="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 hover:border-secondary/30 active:scale-90">
                    <ArrowLeft className="w-5 h-5 text-secondary" />
                </Link>
                <div className="text-center group">
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none flex items-center justify-center gap-1">
                        BOM DE <span className="text-secondary drop-shadow-[0_0_8px_rgba(184,130,10,0.5)]">BÍBLIA+</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-1 mx-auto overflow-hidden">
                        <div className="h-[1px] w-4 bg-gradient-to-r from-transparent to-white/40" />
                        <p className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em] italic">Jornada do Saber</p>
                        <div className="h-[1px] w-4 bg-gradient-to-l from-transparent to-white/40" />
                    </div>
                </div>
                <motion.div 
                    whileHover={{ rotate: 180 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-11 h-11 bg-secondary/20 rounded-2xl flex items-center justify-center border border-secondary/30 shadow-[0_0_20px_rgba(184,130,10,0.2)]"
                >
                    <Trophy className="w-5 h-5 text-secondary" />
                </motion.div>
            </header>

            <main className="p-6 max-w-lg mx-auto">
                <AnimatePresence mode="wait">
                    {gameState === "lobby" && (
                        <motion.div 
                            key="lobby"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 pt-10 px-4"
                        >
                            <div className="bg-white/5 backdrop-blur-3xl p-10 text-center space-y-10 rounded-[50px] border border-white/10 relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] group">
                                {isLocked && (
                                    <div className="absolute inset-0 bg-[#0E1B5C]/90 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-8 text-center">
                                        <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
                                            <Lock className="w-10 h-10 text-secondary" />
                                        </div>
                                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Portal Fechado</h2>
                                        <p className="text-white/40 text-sm mt-3 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                                            Alcance o <span className="text-secondary">Nível 10</span> para participar dos encontros.
                                        </p>
                                    </div>
                                )}
                                
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -ml-32 -mb-32 blur-[100px]" />
                                
                                <motion.div 
                                    animate={{ 
                                        y: [0, -15, 0],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-32 h-32 bg-gradient-to-br from-[#1A237E] to-[#0E1B5C] rounded-[45px] mx-auto flex items-center justify-center border-4 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-10"
                                >
                                    <div className="absolute inset-0 bg-secondary/5 rounded-[45px] animate-pulse" />
                                    <BookOpen className="w-16 h-16 text-secondary drop-shadow-[0_0_15px_rgba(184,130,10,0.6)]" />
                                </motion.div>

                                <div className="space-y-4 relative z-10">
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                                        Encontro da <br/><span className="text-secondary">Semana</span>
                                    </h2>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                                            Plano: <span className="text-white">{activePlan?.name}</span>
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={startSearch}
                                    disabled={isLocked}
                                    className="w-full relative group/btn overflow-hidden rounded-[32px] transition-all active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-yellow-600 transition-all group-hover/btn:scale-110" />
                                    <div className="relative py-6 px-8 flex items-center justify-center gap-4 text-primary font-black text-xl italic tracking-tighter uppercase">
                                        <Zap className="w-7 h-7 fill-current" />
                                        {isLocked ? "ACESSO BLOQUEADO" : "BUSCAR COMPANHEIRO"}
                                    </div>
                                </button>

                                {searchingTimeout && (
                                    <motion.p 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-red-400 text-[10px] font-black uppercase tracking-widest mt-4"
                                    >
                                        Ninguém no seu nível online agora. Tente novamente em instantes!
                                    </motion.p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6 pb-10">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] text-center shadow-2xl relative group">
                                    <p className="text-[10px] font-black uppercase text-white/30 mb-2 tracking-[0.3em]">Encontros Hoje</p>
                                    <p className="text-4xl font-black italic tracking-tighter text-white">5</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] text-center shadow-2xl relative group">
                                    <p className="text-[10px] font-black uppercase text-white/30 mb-2 tracking-[0.3em]">Conquistas</p>
                                    <p className="text-4xl font-black italic tracking-tighter text-emerald-400">80%</p>
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
                                    className="w-64 h-64 border-2 border-dashed border-secondary/20 rounded-full"
                                />
                                <motion.div 
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                    className="absolute inset-4 border-2 border-dashed border-primary/20 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 bg-[#050B2C] rounded-full border-4 border-primary shadow-[0_0_60px_rgba(59,130,246,0.3)] flex items-center justify-center relative overflow-hidden">
                                        <motion.div 
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 bg-primary"
                                        />
                                        <Users className="w-12 h-12 text-primary relative z-10"/>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center space-y-3">
                                <h3 className="text-3xl font-black italic tracking-tight uppercase bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent animate-pulse">
                                    Aguardando Amigo...
                                </h3>
                                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">{activePlan?.name}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* gameState === "playing" is handled in the previous replace call */}
                    <div />

                    {gameState === "result" && (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-10 pt-10"
                        >
                            <div className="relative inline-block">
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className={cn(
                                        "absolute inset-0 blur-3xl rounded-full",
                                        score >= opponentScore ? "bg-secondary" : "bg-red-500"
                                    )}
                                />
                                <div className={cn(
                                    "w-40 h-40 rounded-[50px] relative z-10 flex items-center justify-center shadow-2xl border-4 border-white/20",
                                    score >= opponentScore 
                                        ? "bg-gradient-to-br from-secondary to-yellow-700" 
                                        : "bg-gradient-to-br from-red-600 to-red-900"
                                )}>
                                    {score >= opponentScore 
                                        ? <Trophy className="w-20 h-20 text-white drop-shadow-xl" /> 
                                        : <X className="w-20 h-20 text-white drop-shadow-xl" />
                                    }
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">
                                    {score >= opponentScore ? "CONQUISTA!" : "TENTE DE NOVO"}
                                </h2>
                                <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] bg-white/5 inline-block px-4 py-1 rounded-full border border-white/5">
                                    {score >= opponentScore ? `Você superou ${opponentName}` : `${opponentName} se destacou`}
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[50px] border border-white/10 shadow-2xl space-y-8">
                                <div className="flex justify-around items-center">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">Seus Pontos</p>
                                        <p className="text-5xl font-black text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">{score}</p>
                                    </div>
                                    <div className="h-20 w-px bg-white/10" />
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">{opponentName}</p>
                                        <p className="text-5xl font-black text-red-500/60">{opponentScore}</p>
                                    </div>
                                </div>
                                
                                {score >= opponentScore && (
                                    <div className="pt-6 border-t border-white/5">
                                        <div className="flex items-center justify-center gap-3 text-secondary">
                                            <Zap className="w-5 h-5 fill-current" />
                                            <span className="text-sm font-black uppercase tracking-widest">+40 XP de Sabedoria conquistados</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setGameState("lobby")}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-6 rounded-[32px] border border-white/10 transition-all uppercase tracking-widest active:scale-95 text-xs shadow-xl"
                                >
                                    VOLTAR AO INÍCIO
                                </button>
                                <button 
                                    onClick={startSearch}
                                    className="flex-1 bg-secondary text-primary font-black py-6 rounded-[32px] shadow-[0_20px_40px_rgba(184,130,10,0.3)] hover:scale-[1.02] transition-all uppercase tracking-widest active:scale-95 text-xs italic"
                                >
                                    NOVO ENCONTRO
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
