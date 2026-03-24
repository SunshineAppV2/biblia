"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SECONDS = 10;
const PAGE_FLIP_INTERVAL = 1400; // ms between flips

function BookAnimation() {
    const [flipPhase, setFlipPhase] = useState(0); // 0=rest, 1=lifting, 2=landing

    useEffect(() => {
        const cycle = () => {
            setFlipPhase(1);
            setTimeout(() => setFlipPhase(2), 500);
            setTimeout(() => setFlipPhase(0), 1000);
        };
        const interval = setInterval(cycle, PAGE_FLIP_INTERVAL);
        cycle();
        return () => clearInterval(interval);
    }, []);

    // Page layer offsets (bottom fan effect)
    const layers = [0, 1, 2, 3, 4];

    return (
        <svg
            viewBox="0 0 280 160"
            width="300"
            height="170"
            style={{ filter: "drop-shadow(0 12px 24px rgba(26,35,126,0.25))", overflow: "visible" }}
        >
            <defs>
                <linearGradient id="pageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDFBF7" />
                    <stop offset="100%" stopColor="#E8EDF5" />
                </linearGradient>
                <linearGradient id="spineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C5A059" />
                    <stop offset="50%" stopColor="#8B6914" />
                    <stop offset="100%" stopColor="#C5A059" />
                </linearGradient>
                <linearGradient id="coverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1A237E" />
                    <stop offset="100%" stopColor="#283593" />
                </linearGradient>
                <clipPath id="leftClip">
                    <rect x="0" y="0" width="140" height="160" />
                </clipPath>
                <clipPath id="rightClip">
                    <rect x="140" y="0" width="140" height="160" />
                </clipPath>
            </defs>

            {/* ── PAGE LAYERS (bottom fan) ── */}
            {layers.map((l) => {
                const offset = l * 4;
                return (
                    <g key={l} opacity={1 - l * 0.12}>
                        {/* Left layer */}
                        <path
                            d={`M 140,${90 + offset} C 100,${72 + offset} 50,${60 + offset} 8,${62 + offset} L 8,${68 + offset} C 50,${66 + offset} 100,${78 + offset} 140,${96 + offset}`}
                            fill="none"
                            stroke={l === 0 ? "#1A237E" : "#455A80"}
                            strokeWidth={l === 0 ? 2.5 : 1.5}
                            strokeLinecap="round"
                            opacity={0.3 + l * 0.1}
                        />
                        {/* Right layer */}
                        <path
                            d={`M 140,${90 + offset} C 180,${72 + offset} 230,${60 + offset} 272,${62 + offset} L 272,${68 + offset} C 230,${66 + offset} 180,${78 + offset} 140,${96 + offset}`}
                            fill="none"
                            stroke={l === 0 ? "#1A237E" : "#455A80"}
                            strokeWidth={l === 0 ? 2.5 : 1.5}
                            strokeLinecap="round"
                            opacity={0.3 + l * 0.1}
                        />
                    </g>
                );
            })}

            {/* ── LEFT PAGE SURFACE ── */}
            <path
                d="M 140,20 C 100,8 50,12 8,18 L 8,62 C 50,56 100,68 140,90 Z"
                fill="url(#pageGrad)"
                stroke="#1A237E"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            {/* Left page text lines */}
            {[28, 36, 44, 52, 60, 68].map((y, i) => (
                <line
                    key={i}
                    x1={20 + i * 2} y1={y}
                    x2={118 - i * 3} y2={y - 4}
                    stroke="#455A80" strokeWidth="1" opacity="0.2"
                    strokeLinecap="round"
                />
            ))}

            {/* ── RIGHT PAGE SURFACE (static base) ── */}
            <path
                d="M 140,20 C 180,8 230,12 272,18 L 272,62 C 230,56 180,68 140,90 Z"
                fill="url(#pageGrad)"
                stroke="#1A237E"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            {/* Right page text lines */}
            {[28, 36, 44, 52, 60, 68].map((y, i) => (
                <line
                    key={i}
                    x1={162 + i * 3} y1={y - 4}
                    x2={258 - i * 2} y2={y}
                    stroke="#455A80" strokeWidth="1" opacity="0.2"
                    strokeLinecap="round"
                />
            ))}

            {/* ── ANIMATED FLIPPING PAGE ── */}
            <motion.path
                d="M 140,20 C 180,8 230,12 272,18 L 272,62 C 230,56 180,68 140,90 Z"
                fill="#EEF0F8"
                stroke="#1A237E"
                strokeWidth="1.5"
                animate={
                    flipPhase === 1
                        ? { d: "M 140,20 C 140,14 140,14 140,20 L 140,90 C 140,84 140,84 140,90 Z", opacity: 0.9 }
                        : flipPhase === 2
                        ? { d: "M 140,20 C 100,8 50,12 8,18 L 8,62 C 50,56 100,68 140,90 Z", opacity: 0.7 }
                        : { d: "M 140,20 C 180,8 230,12 272,18 L 272,62 C 230,56 180,68 140,90 Z", opacity: 0 }
                }
                transition={{ duration: 0.48, ease: "easeInOut" }}
            />

            {/* ── SPINE ── */}
            <path
                d="M 140,18 C 136,50 136,70 140,92 C 144,70 144,50 140,18 Z"
                fill="url(#spineGrad)"
                stroke="#C5A059"
                strokeWidth="0.5"
            />

            {/* ── BOTTOM SPINE CURVE ── */}
            <path
                d="M 8,62 C 50,58 100,74 140,92 C 180,74 230,58 272,62"
                fill="none"
                stroke="#1A237E"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* ── COVER EDGES (left & right) ── */}
            <path d="M 8,18 L 8,66" stroke="#1A237E" strokeWidth="3" strokeLinecap="round" />
            <path d="M 272,18 L 272,66" stroke="#1A237E" strokeWidth="3" strokeLinecap="round" />

            {/* ── CROSS SYMBOL on left page ── */}
            <text x="58" y="55" textAnchor="middle" fontSize="14" fill="#C5A059" opacity="0.35" fontWeight="bold">✝</text>
        </svg>
    );
}

export function SplashScreen() {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = (Date.now() - start) / (TOTAL_SECONDS * 1000);
            setProgress(Math.min(elapsed, 1));
            if (elapsed >= 1) {
                clearInterval(interval);
                setTimeout(() => setVisible(false), 400);
            }
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleSkip = () => setVisible(false);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{ background: "linear-gradient(160deg, #E8EDF5 0%, #D0D8E8 50%, #E8EDF5 100%)" }}
                >
                    {/* Ambient glow */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "#1A237E" }} />
                        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-64 h-64 rounded-full opacity-15 blur-3xl" style={{ background: "#C5A059" }} />
                    </div>

                    {/* Content */}
                    <div className="relative flex flex-col items-center gap-10">

                        {/* Bible animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            <BookAnimation />
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            className="text-center space-y-2"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            <h1
                                className="text-5xl font-black tracking-tight"
                                style={{
                                    background: "linear-gradient(135deg, #C5A059 0%, #1A237E 50%, #C5A059 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                BibleQuest
                            </h1>
                            <p className="text-sm font-semibold tracking-[0.3em] uppercase" style={{ color: "#455A80" }}>
                                Sua jornada bíblica começa aqui
                            </p>
                        </motion.div>

                        {/* Progress bar */}
                        <motion.div
                            className="w-48 space-y-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(26,35,126,0.15)" }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        background: "linear-gradient(to right, #C5A059, #1A237E)",
                                        width: `${progress * 100}%`,
                                    }}
                                    transition={{ duration: 0.05 }}
                                />
                            </div>
                        </motion.div>

                        {/* Skip button */}
                        <motion.button
                            onClick={handleSkip}
                            className="text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full border transition-all"
                            style={{
                                color: "#455A80",
                                borderColor: "rgba(69,90,128,0.3)",
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Pular
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
