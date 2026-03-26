"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, ChevronRight, Trophy, Brain, Clock } from "lucide-react";
import { prepareQuiz, getQuizBank, PreparedQuestion } from "@/lib/quiz-data";

/** Calculates time in seconds based on total character count of question + options */
function calcTime(question: PreparedQuestion): number {
    const totalChars = question.question.length + question.options.join("").length;
    // 30s base + 1s per 20 extra chars beyond 100
    return Math.max(30, 30 + Math.floor(Math.max(0, totalChars - 100) / 20));
}

const XP_CORRECT = 30;
const XP_WRONG = -15;

function getComboMultiplier(combo: number): number {
    if (combo >= 2) return 2.0;
    if (combo === 1) return 1.5;
    return 1.0;
}
function getComboLabel(combo: number): string {
    if (combo >= 2) return "COMBO ×2!";
    if (combo === 1) return "COMBO ×1.5!";
    return "";
}

const CONFETTI_EMOJIS = ["🎉", "✨", "🏆", "⭐", "🎊", "💫", "🌟", "🙌"];
const SAD_EMOJIS = ["😢", "💧", "😞", "📖", "🙈"];

interface QuizModalProps {
    isOpen: boolean;
    bookId: string;
    bookName: string;
    chapter: number;
    onComplete: (xpDelta: number, correctCount: number) => void;
}

type AnswerState = "unanswered" | "correct" | "wrong";

function Particle({ emoji, delay }: { emoji: string; delay: number }) {
    const x = (Math.random() - 0.5) * 400;
    const y = -(100 + Math.random() * 300);
    return (
        <motion.span
            className="fixed text-2xl pointer-events-none select-none"
            style={{ left: "50%", top: "50%", zIndex: 9999 }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: 0, x, y, scale: [0, 1.4, 1], rotate: Math.random() * 360 }}
            transition={{ duration: 1.4 + Math.random() * 0.6, delay, ease: "easeOut" }}
        >
            {emoji}
        </motion.span>
    );
}

function ConfettiParticles() {
    const particles = Array.from({ length: 18 }, (_, i) => ({
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        delay: i * 0.06,
    }));
    return <>{particles.map((p, i) => <Particle key={i} emoji={p.emoji} delay={p.delay} />)}</>;
}

function SadParticles() {
    const particles = Array.from({ length: 10 }, (_, i) => ({
        emoji: SAD_EMOJIS[i % SAD_EMOJIS.length],
        delay: i * 0.1,
    }));
    return <>{particles.map((p, i) => <Particle key={i} emoji={p.emoji} delay={p.delay} />)}</>;
}

export function QuizModal({ isOpen, bookId, bookName, chapter, onComplete }: QuizModalProps) {
    const [questions] = useState<PreparedQuestion[]>(() => {
        const bank = getQuizBank(bookId, chapter);
        if (!bank) return [];
        return prepareQuiz(bank, 3);
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
    const [xpDelta, setXpDelta] = useState(0);
    const [results, setResults] = useState<AnswerState[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const [combo, setCombo] = useState(0);
    const [lastXpGained, setLastXpGained] = useState(0);

    // Timer
    const [timeLeft, setTimeLeft] = useState(() =>
        questions.length > 0 ? calcTime(questions[0]) : 30
    );
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isOpen || answerState !== "unanswered" || showResults) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time's up — mark as wrong
                    clearInterval(timerRef.current!);
                    setAnswerState("wrong");
                    setXpDelta(d => d + XP_WRONG);
                    setResults(r => [...r, "wrong"]);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current!);
    }, [isOpen, currentIndex, answerState, showResults]);

    // Reset timer when question changes
    useEffect(() => {
        if (questions.length > 0 && currentIndex < questions.length) {
            setTimeLeft(calcTime(questions[currentIndex]));
        }
    }, [currentIndex]);

    if (!isOpen) return null;

    if (questions.length === 0) {
        onComplete(0, 0);
        return null;
    }

    const currentQuestion = questions[currentIndex];
    const correctCount = results.filter(r => r === "correct").length;

    const handleOptionSelect = (optionIndex: number) => {
        if (answerState !== "unanswered") return;
        clearInterval(timerRef.current!);
        setSelectedOption(optionIndex);

        const isCorrect = optionIndex === currentQuestion.correctIndex;
        const state: AnswerState = isCorrect ? "correct" : "wrong";
        setAnswerState(state);
        if (isCorrect) {
            const multiplier = getComboMultiplier(combo);
            const gained = Math.round(XP_CORRECT * multiplier);
            setLastXpGained(gained);
            setXpDelta(prev => prev + gained);
            setCombo(c => c + 1);
        } else {
            setLastXpGained(XP_WRONG);
            setXpDelta(prev => prev + XP_WRONG);
            setCombo(0);
        }
        setResults(prev => [...prev, state]);
    };

    const handleNext = () => {
        if (currentIndex + 1 >= questions.length) {
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 2000);
            setShowResults(true);
        } else {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setAnswerState("unanswered");
        }
    };

    const handleFinish = () => {
        onComplete(xpDelta, correctCount);
    };

    const isPerfect = correctCount === 3;
    const isZero = correctCount === 0 && showResults;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            {showParticles && (isPerfect ? <ConfettiParticles /> : isZero ? <SadParticles /> : null)}

            <AnimatePresence mode="wait">
                {!showResults ? (
                    <motion.div
                        key={`question-${currentIndex}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.25 }}
                        className="w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
                        style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between"
                            style={{ background: "linear-gradient(135deg, #1A237E, #0D47A1)" }}>
                            <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-white" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">
                                    {bookName} {chapter}
                                </span>
                            </div>
                            {/* Progress dots */}
                            <div className="flex items-center gap-1.5">
                                {questions.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "rounded-full transition-all duration-300",
                                            i < currentIndex
                                                ? results[i] === "correct"
                                                    ? "bg-accent w-2 h-2"
                                                    : "bg-red-400 w-2 h-2"
                                                : i === currentIndex
                                                    ? "bg-primary w-4 h-2"
                                                    : "bg-muted w-2 h-2"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Combo indicator */}
                        <AnimatePresence>
                            {combo > 0 && (
                                <motion.div
                                    key={combo}
                                    initial={{ opacity: 0, scale: 0.7, y: -8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center justify-center gap-2 py-1.5 text-xs font-black uppercase tracking-widest"
                                    style={{ background: combo >= 2 ? "rgba(184,130,10,0.15)" : "rgba(13,71,161,0.12)" }}
                                >
                                    <span className="text-base">{combo >= 2 ? "🔥" : "⚡"}</span>
                                    <span style={{ color: combo >= 2 ? "#B8820A" : "var(--accent)" }}>
                                        {getComboLabel(combo)}
                                    </span>
                                    <span className="text-muted-foreground font-normal normal-case tracking-normal text-[10px]">
                                        próximo acerto = +{Math.round(XP_CORRECT * getComboMultiplier(combo))} XP
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Timer bar */}
                        {answerState === "unanswered" && (() => {
                            const total = calcTime(questions[currentIndex]);
                            const pct = (timeLeft / total) * 100;
                            const urgent = timeLeft <= 10;
                            return (
                                <div className="px-4 py-2 bg-primary/10 border-b border-secondary/10 flex items-center gap-3">
                                    <Clock className={cn("w-3 h-3 shrink-0", urgent ? "text-red-400" : "text-muted-foreground")} />
                                    <div className="flex-1 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                                        <motion.div
                                            className={cn("h-full rounded-full", urgent ? "bg-red-500" : "bg-primary")}
                                            style={{ width: `${pct}%` }}
                                            transition={{ duration: 0.9, ease: "linear" }}
                                        />
                                    </div>
                                    <span className={cn("text-xs font-black w-6 text-right tabular-nums", urgent ? "text-red-400" : "text-muted-foreground")}>
                                        {timeLeft}s
                                    </span>
                                </div>
                            );
                        })()}

                        {/* Question */}
                        <div className="p-6 space-y-5">
                            <p className="text-gray-900 dark:text-white font-bold text-base leading-snug">
                                {currentIndex + 1}. {currentQuestion.question}
                            </p>

                            <div className="space-y-2">
                                {currentQuestion.options.map((option, i) => {
                                    const isSelected = selectedOption === i;
                                    const isCorrect = i === currentQuestion.correctIndex;
                                    const revealed = answerState !== "unanswered";

                                    return (
                                        <motion.button
                                            key={i}
                                            onClick={() => handleOptionSelect(i)}
                                            disabled={revealed}
                                            whileTap={!revealed ? { scale: 0.98 } : {}}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                                                !revealed && "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-800 dark:text-gray-100 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-white/10",
                                                revealed && isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
                                                revealed && isSelected && !isCorrect && "border-red-400 bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400",
                                                revealed && !isSelected && !isCorrect && "border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-600 opacity-50"
                                            )}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className={cn(
                                                    "w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-black shrink-0",
                                                    !revealed && "border-gray-300 dark:border-white/15 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5",
                                                    revealed && isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                                                    revealed && isSelected && !isCorrect && "border-red-400 bg-red-400 text-white",
                                                    revealed && !isSelected && !isCorrect && "border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500"
                                                )}>
                                                    {["A", "B", "C"][i]}
                                                </span>
                                                {option}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Feedback row */}
                            <AnimatePresence>
                                {answerState !== "unanswered" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3 pt-1"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className={cn(
                                                "flex items-center gap-2 text-sm font-bold",
                                                answerState === "correct" ? "text-accent" : "text-red-400"
                                            )}>
                                                {answerState === "correct"
                                                    ? <><CheckCircle className="w-4 h-4" /> Correto! +{lastXpGained} XP{lastXpGained > XP_CORRECT && <span className="text-secondary text-xs">🔥 combo!</span>}</>
                                                    : <><XCircle className="w-4 h-4" /> {selectedOption === null ? "Tempo esgotado!" : "Errado!"} {XP_WRONG} XP</>
                                                }
                                            </div>
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleNext}
                                                className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold"
                                                style={{ background: "linear-gradient(135deg, #1A237E, #0D47A1)", color: "white" }}
                                            >
                                                {currentIndex + 1 >= questions.length ? "Resultado" : "Próxima"}
                                                <ChevronRight className="w-3 h-3" />
                                            </motion.button>
                                        </div>

                                        {/* Correct answer hint when wrong */}
                                        {answerState === "wrong" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                                                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
                                            >
                                                <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-[11px] font-black text-accent uppercase tracking-wider mb-0.5">
                                                        Resposta correta
                                                    </p>
                                                    <p className="text-xs text-foreground leading-snug">
                                                        {currentQuestion.options[currentQuestion.correctIndex]}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 250, damping: 20 }}
                        className="w-full max-w-sm p-8 text-center space-y-6 rounded-2xl shadow-2xl"
                        style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        {/* Result emoji + message */}
                        <div className="space-y-3">
                            <motion.div
                                className="text-6xl"
                                animate={isPerfect
                                    ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }
                                    : isZero
                                        ? { y: [0, -8, 0, -4, 0] }
                                        : {}
                                }
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                {isPerfect ? "🏆" : correctCount === 2 ? "⭐" : correctCount === 1 ? "📖" : "😢"}
                            </motion.div>

                            <h3 className={cn(
                                "text-2xl font-black",
                                isPerfect ? "text-yellow-500" : isZero ? "text-red-400" : "text-gray-900 dark:text-white"
                            )}>
                                {isPerfect ? "Perfeito! 3/3" : `${correctCount}/3 corretas`}
                            </h3>

                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {isPerfect
                                    ? "Incrível! Você leu com total atenção e dominou o capítulo. Parabéns!"
                                    : correctCount === 2
                                        ? "Muito bem! Só faltou um pouquinho. Continue assim!"
                                        : correctCount === 1
                                            ? "Leia com mais atenção da próxima vez. Você consegue!"
                                            : "Que tristeza... Que tal reler o capítulo antes de continuar?"}
                            </p>
                        </div>

                        {/* Results breakdown */}
                        <div className="flex justify-center gap-2">
                            {results.map((r, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        r === "correct"
                                            ? "bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-400"
                                            : "bg-red-50 dark:bg-red-500/20 border border-red-400"
                                    )}
                                >
                                    {r === "correct"
                                        ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        : <XCircle className="w-5 h-5 text-red-500" />
                                    }
                                </div>
                            ))}
                        </div>

                        {/* XP result */}
                        <div className={cn(
                            "rounded-2xl p-4 border space-y-1",
                            xpDelta > 0
                                ? "bg-accent/10 border-accent/20"
                                : xpDelta < 0
                                    ? "bg-red-500/10 border-red-500/20"
                                    : "bg-primary/15 border-secondary/10"
                        )}>
                            <div className="flex items-center justify-center gap-2">
                                <Trophy className={cn(
                                    "w-5 h-5",
                                    xpDelta > 0 ? "text-accent" : xpDelta < 0 ? "text-red-400" : "text-muted-foreground"
                                )} />
                                <span className={cn(
                                    "text-2xl font-black",
                                    xpDelta > 0 ? "text-accent" : xpDelta < 0 ? "text-red-400" : "text-muted-foreground"
                                )}>
                                    {xpDelta > 0 ? "+" : ""}{xpDelta} XP
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                + 50 XP pela leitura = <strong>{50 + xpDelta} XP</strong> total neste capítulo
                            </p>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleFinish}
                            className={cn(
                                "w-full py-3 font-bold rounded-full transition-colors",
                                isPerfect
                                    ? "bg-secondary text-secondary-foreground hover:opacity-90 shadow-[0_0_20px_rgba(197,160,89,0.5)]"
                                    : "bg-accent text-accent-foreground hover:opacity-90"
                            )}
                        >
                            {isPerfect ? "🎉 Continuar!" : "Continuar"}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
