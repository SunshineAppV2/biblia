"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Gem, ArrowLeft, Check, X, Timer, Users, Scroll, Sword, PenTool, BookOpen, Mail, Eye, Star, Lock } from "lucide-react";
import Link from "next/link";
import { addUserXp } from "@/lib/firestore";
import { trackArenaWin } from "@/components/DailyMissions";
import { completeMissionXP } from "@/lib/progress";
import { useToast } from "@/components/Toast";
import { MobileNav } from "@/components/MobileNav";
import { Roleta } from "@/components/Roleta";
import { cn } from "@/lib/utils";

const TRIVIA_QUESTIONS = {
    lei: [
        { q: "¿Quem escreveu os primeiros 5 livros da Bíblia?", a: ["Moisés", "Abraão", "Davi", "Pedro"], correct: 0 },
        { q: "¿Qual o 1º pecado relatado em Gênesis?", a: ["Inveja", "Desobediência", "Mentira", "Preguiça"], correct: 1 },
    ],
    historia: [
        { q: "¿Qual cidade teve os muros caídos com trombetas?", a: ["Babilônia", "Jericó", "Jerusalém", "Nínive"], correct: 1 },
        { q: "¿Quem foi o primeiro rei de Israel?", a: ["Davi", "Saul", "Salomão", "Samuel"], correct: 1 },
    ],
    poesia: [
        { q: "¿Quem escreveu a maioria dos Salmos?", a: ["Davi", "Asafe", "Salomão", "Moisés"], correct: 0 },
        { q: "¿Quem é o autor de Eclesiastes?", a: ["Davi", "Salomão", "Provérbios", "Jeremias"], correct: 1 },
    ],
    evangelhos: [
        { q: "¿Quantos discípulos Jesus tinha?", a: ["10", "12", "7", "40"], correct: 1 },
        { q: "¿Onde Jesus nasceu?", a: ["Jerusalém", "Nazaré", "Belém", "Roma"], correct: 2 },
    ],
    cartas: [
        { q: "¿Quem escreveu a maioria das cartas do NT?", a: ["João", "Pedro", "Paulo", "Tiago"], correct: 2 },
        { q: "¿Para qual igreja Paulo escreveu sobre o 'Amor'?", a: ["Efésios", "Coríntios", "Gálatas", "Filipenses"], correct: 1 },
    ],
    profecia: [
        { q: "¿Quem viu os 4 cavalos no Apocalipse?", a: ["João", "Daniel", "Ezequiel", "Pedro"], correct: 0 },
        { q: "¿Qual profeta foi jogado na cova dos leões?", a: ["Esaú", "Daniel", "Elias", "Isaías"], correct: 1 },
    ],
};

const CATEGORIES = [
    { id: "lei", label: "Lei", icon: Scroll, color: "#FF5722" },
    { id: "historia", label: "História", icon: Sword, color: "#FFC107" },
    { id: "poesia", label: "Poesia", icon: PenTool, color: "#4CAF50" },
    { id: "evangelhos", label: "Evangelhos", icon: BookOpen, color: "#2196F3" },
    { id: "cartas", label: "Cartas", icon: Mail, color: "#9C27B0" },
    { id: "profecia", label: "Profecia", icon: Eye, color: "#E91E63" },
];

export default function MestreDoSaberPage() {
    const { profile, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const [gameState, setGameState] = useState<"lobby" | "searching" | "spinning" | "playing" | "result">("lobby");
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [opponentName, setOpponentName] = useState("");
    const [characters, setCharacters] = useState<string[]>([]); // Categorias ganhas

    const userLevel = Math.floor((profile?.xp || 0) / 1000);
    const isLocked = userLevel < 20;

    const startSearch = () => {
        if (isLocked) return;
        setGameState("searching");
        const opponents = ["Calebe77", "Debora_B", "Samuel_Vip", "Ester_Rainha"];
        setOpponentName(opponents[Math.floor(Math.random() * opponents.length)]);
        setTimeout(() => setGameState("spinning"), 2500);
    };

    const handleSpinEnd = (category: any) => {
        if (category.id === "coroa") {
            const randomCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
            setSelectedCategory(randomCat);
        } else {
            setSelectedCategory(category);
        }
        
        setTimeout(() => {
            setGameState("playing");
            const catId = (category.id === "coroa" ? "lei" : category.id) as keyof typeof TRIVIA_QUESTIONS;
            const qList = TRIVIA_QUESTIONS[catId] || TRIVIA_QUESTIONS.lei;
            setCurrentQuestion(qList[Math.floor(Math.random() * qList.length)]);
        }, 1000);
    };

    const handleAnswer = async (index: number) => {
        const isCorrect = index === currentQuestion.correct;
        if (isCorrect) {
            setScore(prev => prev + 1);
            showToast("CORRETÍSSIMO! +20 XP", "achievement");
            if (profile) await addUserXp(profile.uid, 20);
            
            if (!characters.includes(selectedCategory.id)) {
                setCharacters(prev => [...prev, selectedCategory.id]);
            }
        } else {
            showToast("QUE PENA, ERROU!", "error");
        }

        setGameState("result");
        if (profile) await refreshProfile();
    };

    return (
        <div className="min-h-screen bg-[#0E1B5C] text-white pb-32 overflow-hidden">
            <header className="p-6 flex items-center justify-between glass sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="text-center">
                    <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">BIBLIA<span className="text-secondary">QUIZ+</span></h1>
                    <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mt-1">Desafio Bíblico Global</p>
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
                            className="space-y-8 pt-10"
                        >
                            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] text-center space-y-6 relative overflow-hidden">
                                {isLocked && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                        <Lock className="w-8 h-8 text-secondary" />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase">Bloqueado</h2>
                                    <p className="text-sm text-white/60">Alcance o <span className="text-secondary font-black">Nível 20</span> para desbloquear este desafio épico!</p>
                                </div>}

                                <div className="w-20 h-20 bg-secondary/20 rounded-3xl mx-auto flex items-center justify-center border-2 border-secondary/40 shadow-[0_0_30px_rgba(184,130,10,0.2)]">
                                    <Star className="w-10 h-10 text-secondary fill-current" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black italic uppercase">BIBLIAQUIZ+</h2>
                                    <p className="text-white/60 text-sm">Mostre que você domina as Escrituras e colecione todos os 6 selos sagrados.</p>
                                </div>
                                <button 
                                    onClick={startSearch}
                                    disabled={isLocked}
                                    className="w-full bg-secondary hover:bg-secondary/90 disabled:bg-white/10 text-white font-black py-5 rounded-3xl shadow-xl shadow-secondary/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <Zap className="w-6 h-6" />
                                    {isLocked ? "BLOQUEADO" : "INICIAR DESAFIO"}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 px-2 flex justify-between">
                                    Seus Selos QUIZ+ <span>{characters.length}/6</span>
                                </h3>
                                <div className="grid grid-cols-6 gap-2">
                                    {CATEGORIES.map(cat => (
                                        <div 
                                            key={cat.id} 
                                            className={cn(
                                                "aspect-square rounded-2xl flex items-center justify-center border-2 transition-all",
                                                characters.includes(cat.id) 
                                                    ? "bg-white border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                                                    : "bg-white/5 border-white/10 opacity-30"
                                            )}
                                        >
                                            <cat.icon className={cn("w-6 h-6", characters.includes(cat.id) ? "text-[#0E1B5C]" : "text-white")} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {gameState === "searching" && (
                        <motion.div 
                            key="searching"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center min-h-[60vh] gap-8"
                        >
                            <div className="relative">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    className="w-48 h-48 border-4 border-dashed border-secondary/40 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-primary rounded-full border-4 border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                                        <Users className="w-12 h-12 text-white/40"/>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black italic animate-pulse uppercase">Convocando oponentes...</h3>
                        </motion.div>
                    )}

                    {gameState === "spinning" && (
                        <motion.div 
                            key="spinning"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="pt-10 flex flex-col items-center gap-8"
                        >
                            <h2 className="text-2xl font-black italic tracking-tight uppercase">Qual sua especialidade?</h2>
                            <Roleta onSpinEnd={handleSpinEnd} />
                        </motion.div>
                    )}

                    {gameState === "playing" && (
                        <motion.div 
                            key="playing"
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="space-y-8 pt-10"
                        >
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-[40px] border border-white/10">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: selectedCategory.color }}>
                                    <selectedCategory.icon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white/40">Pergunta Sobre</p>
                                    <h3 className="text-xl font-black italic uppercase">{selectedCategory.label}</h3>
                                </div>
                            </div>

                            <div className="bg-white rounded-[40px] p-8 text-black shadow-2xl space-y-8 min-h-[400px] flex flex-col justify-center text-center relative overflow-hidden">
                                <h3 className="text-2xl font-black italic tracking-tight leading-tight">
                                    {currentQuestion.q}
                                </h3>
                                
                                <div className="grid gap-3">
                                    {currentQuestion.a.map((opt: string, i: number) => (
                                        <button 
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            className="w-full bg-[#F5F7FA] hover:bg-secondary hover:text-white border-2 border-black/5 p-5 rounded-2xl text-sm font-bold transition-all text-left flex items-center justify-between group"
                                        >
                                            {opt}
                                            <Check className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                            <div className="text-6xl">✨</div>
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Turno<br/>Sincronizado</h2>
                            <p className="text-white/60 px-10">Oponente sorteado: <span className="text-secondary font-black">{opponentName}</span>. Ele tem tempo para responder e o resultado será enviado em suas notificações.</p>
                            
                            <div className="bg-white/10 p-8 rounded-[40px] border border-white/20">
                                <p className="text-sm font-black uppercase tracking-widest text-secondary">Aguardando...</p>
                            </div>

                            <button 
                                onClick={() => setGameState("lobby")}
                                className="w-full bg-white text-[#0E1B5C] font-black py-5 rounded-3xl shadow-xl transition-all uppercase tracking-widest"
                            >
                                Voltar ao Templo
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <MobileNav />
        </div>
    );
}
