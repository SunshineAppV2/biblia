"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SECONDS = 10;
const PAGE_FLIP_INTERVAL = 1400; // ms between flips

function BookAnimation() {
    const [flipPhase, setFlipPhase] = useState(0); // 0=rest, 1=mid, 2=landed

    useEffect(() => {
        const cycle = () => {
            setFlipPhase(1);
            setTimeout(() => setFlipPhase(2), 520);
            setTimeout(() => setFlipPhase(0), 1050);
        };
        const t = setTimeout(cycle, 600);
        const interval = setInterval(cycle, PAGE_FLIP_INTERVAL);
        return () => { clearTimeout(t); clearInterval(interval); };
    }, []);

    // Each layer offset for the page-stack fan
    const stackLayers = [5, 4, 3, 2, 1];

    return (
        <svg
            viewBox="0 0 340 220"
            width="320"
            height="207"
            style={{ overflow: "visible", filter: "drop-shadow(0 16px 32px rgba(26,35,126,0.3))" }}
        >
            <defs>
                <linearGradient id="lPageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5F3EE" />
                    <stop offset="100%" stopColor="#E8E4D8" />
                </linearGradient>
                <linearGradient id="rPageGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F5F3EE" />
                    <stop offset="100%" stopColor="#E8E4D8" />
                </linearGradient>
                <linearGradient id="spineGold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B6914" />
                    <stop offset="50%" stopColor="#C5A059" />
                    <stop offset="100%" stopColor="#8B6914" />
                </linearGradient>
            </defs>

            {/* ── COVER BACK (left) ── */}
            <path
                d="M 170,170 C 120,152 60,140 14,142 L 10,148 C 58,146 118,158 168,176 Z"
                fill="#0D1754" stroke="#0D1754" strokeWidth="1"
            />
            {/* ── COVER BACK (right) ── */}
            <path
                d="M 170,170 C 220,152 280,140 326,142 L 330,148 C 282,146 222,158 172,176 Z"
                fill="#0D1754" stroke="#0D1754" strokeWidth="1"
            />

            {/* ── PAGE STACK LAYERS (left side) ── */}
            {stackLayers.map((l, i) => (
                <path
                    key={`ls${i}`}
                    d={`M 168,${162 + l} C 118,${144 + l} 58,${132 + l} 12,${134 + l} L 12,${138 + l} C 60,${136 + l} 120,${148 + l} 170,${166 + l}`}
                    fill="none"
                    stroke={`rgba(232,228,216,${0.6 + i * 0.08})`}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            ))}
            {/* ── PAGE STACK LAYERS (right side) ── */}
            {stackLayers.map((l, i) => (
                <path
                    key={`rs${i}`}
                    d={`M 172,${162 + l} C 222,${144 + l} 282,${132 + l} 328,${134 + l} L 328,${138 + l} C 280,${136 + l} 220,${148 + l} 170,${166 + l}`}
                    fill="none"
                    stroke={`rgba(232,228,216,${0.6 + i * 0.08})`}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            ))}

            {/* ── LEFT PAGE SURFACE ── */}
            <path
                d="M 168,38 C 118,22 56,28 12,36 L 12,138 C 60,130 120,144 168,162 Z"
                fill="url(#lPageGrad)"
                stroke="#1A237E"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            {/* Left page inner highlight */}
            <path
                d="M 162,46 C 118,32 62,38 18,44 L 18,130 C 64,122 120,136 164,152 Z"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
            />
            {/* Left text lines */}
            {[65, 80, 95, 110, 125].map((y, i) => (
                <path
                    key={`ll${i}`}
                    d={`M ${30 + i} ${y - i * 0.5} L ${148 - i} ${y + i * 0.5}`}
                    stroke="#1A237E" strokeWidth="1" opacity="0.12" strokeLinecap="round"
                />
            ))}
            {/* Cross */}
            <text x="82" y="105" textAnchor="middle" fontSize="22" fill="#C5A059" opacity="0.25" fontWeight="bold">✝</text>

            {/* ── RIGHT PAGE SURFACE (static base) ── */}
            <path
                d="M 172,38 C 222,22 284,28 328,36 L 328,138 C 280,130 220,144 172,162 Z"
                fill="url(#rPageGrad)"
                stroke="#1A237E"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            {/* Right page inner highlight */}
            <path
                d="M 178,46 C 222,32 278,38 322,44 L 322,130 C 276,122 220,136 176,152 Z"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
            />
            {/* Right text lines */}
            {[65, 80, 95, 110, 125].map((y, i) => (
                <path
                    key={`rl${i}`}
                    d={`M ${192 + i} ${y + i * 0.5} L ${312 - i} ${y - i * 0.5}`}
                    stroke="#1A237E" strokeWidth="1" opacity="0.12" strokeLinecap="round"
                />
            ))}

            {/* ── ANIMATED FLIP PAGE ── */}
            <motion.path
                fill="#EDEAE0"
                stroke="#1A237E"
                strokeWidth="1.5"
                animate={
                    flipPhase === 0
                        ? { d: "M 172,38 C 222,22 284,28 328,36 L 328,138 C 280,130 220,144 172,162 Z", opacity: 0 }
                        : flipPhase === 1
                        ? { d: "M 170,38 C 170,30 170,30 170,38 L 170,162 C 170,154 170,154 170,162 Z", opacity: 0.85 }
                        : { d: "M 168,38 C 118,22 56,28 12,36 L 12,138 C 60,130 120,144 168,162 Z", opacity: 0.55 }
                }
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {/* ── SPINE ── */}
            <path
                d="M 168,36 C 164,90 164,120 168,164 C 172,120 172,90 168,36 Z"
                fill="url(#spineGold)"
            />

            {/* ── BOTTOM GUTTER (concave curve) ── */}
            <path
                d="M 12,138 C 60,128 120,144 168,164 C 216,144 276,128 328,138"
                fill="none"
                stroke="#1A237E"
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* ── COVER BOTTOM EDGE ── */}
            <path
                d="M 10,140 C 58,130 120,146 168,166 C 216,146 278,130 330,140 L 330,148 C 280,138 218,154 168,174 C 118,154 56,138 10,148 Z"
                fill="#0D1754"
                stroke="#1A237E"
                strokeWidth="1"
            />

            {/* ── OUTER COVER EDGES ── */}
            <path d="M 10,36 L 10,148" stroke="#1A237E" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 330,36 L 330,148" stroke="#1A237E" strokeWidth="3.5" strokeLinecap="round" />
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
