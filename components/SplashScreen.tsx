"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SECONDS = 10;
const PAGE_FLIP_INTERVAL = 1400; // ms between flips

function BookAnimation() {
    const [flippedPages, setFlippedPages] = useState<number[]>([]);
    const [currentFlip, setCurrentFlip] = useState(-1);
    const PAGES = [0, 1, 2, 3, 4, 5];

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < PAGES.length) {
                setCurrentFlip(i);
                setTimeout(() => {
                    setFlippedPages(prev => [...prev, i]);
                    setCurrentFlip(-1);
                }, 600);
                i++;
                if (i >= PAGES.length) i = 0; // loop
            }
        }, PAGE_FLIP_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative select-none" style={{ perspective: "800px", width: 200, height: 260 }}>
            {/* Book body */}
            <div className="absolute inset-0 flex" style={{ transformStyle: "preserve-3d" }}>

                {/* LEFT COVER */}
                <div
                    className="absolute left-0 top-0 bottom-0 rounded-l-md shadow-2xl"
                    style={{
                        width: "50%",
                        background: "linear-gradient(135deg, #1A237E 0%, #283593 60%, #1A237E 100%)",
                        borderRight: "2px solid rgba(197,160,89,0.4)",
                    }}
                >
                    {/* Left page lines */}
                    <div className="absolute inset-3 space-y-1.5 overflow-hidden">
                        {Array.from({ length: 14 }).map((_, i) => (
                            <div key={i} className="h-px rounded-full opacity-20" style={{ background: "#C5A059", marginLeft: i % 3 === 0 ? 4 : 0 }} />
                        ))}
                    </div>
                </div>

                {/* SPINE */}
                <div
                    className="absolute z-10"
                    style={{
                        left: "calc(50% - 6px)",
                        top: 0,
                        bottom: 0,
                        width: 12,
                        background: "linear-gradient(to right, #0D1754, #1A237E, #0D1754)",
                        boxShadow: "0 0 12px rgba(197,160,89,0.3)",
                    }}
                >
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="w-1 h-1 rounded-full" style={{ background: "rgba(197,160,89,0.6)" }} />
                        ))}
                    </div>
                </div>

                {/* RIGHT COVER (base) */}
                <div
                    className="absolute right-0 top-0 bottom-0 rounded-r-md"
                    style={{
                        width: "50%",
                        background: "linear-gradient(135deg, #283593 0%, #1A237E 100%)",
                        borderLeft: "1px solid rgba(197,160,89,0.2)",
                    }}
                >
                    <div className="absolute inset-3 space-y-1.5 overflow-hidden">
                        {Array.from({ length: 14 }).map((_, i) => (
                            <div key={i} className="h-px rounded-full opacity-20" style={{ background: "#C5A059" }} />
                        ))}
                    </div>
                </div>

                {/* FLIPPING PAGES — rendered right-to-left */}
                {PAGES.map((page) => {
                    const isFlipped = flippedPages.includes(page);
                    const isFlipping = currentFlip === page;

                    return (
                        <motion.div
                            key={page}
                            className="absolute top-1 bottom-1 overflow-hidden"
                            style={{
                                left: "50%",
                                width: "calc(50% - 8px)",
                                transformOrigin: "left center",
                                transformStyle: "preserve-3d",
                                zIndex: isFlipping ? 20 : PAGES.length - page,
                                background: `hsl(${220 + page * 4}, 20%, ${96 - page}%)`,
                                borderRadius: "0 4px 4px 0",
                                boxShadow: isFlipping
                                    ? "-4px 0 12px rgba(0,0,0,0.3)"
                                    : "-1px 0 4px rgba(0,0,0,0.1)",
                            }}
                            animate={{
                                rotateY: isFlipped ? -174 : isFlipping ? -90 : 0,
                                scaleX: isFlipping ? 0.9 : 1,
                            }}
                            transition={{
                                duration: 0.55,
                                ease: isFlipping ? "easeIn" : isFlipped ? "easeOut" : "linear",
                            }}
                        >
                            {/* Page content lines */}
                            <div className="absolute inset-2 space-y-1.5 overflow-hidden">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-px rounded-full"
                                        style={{
                                            background: "#455A80",
                                            opacity: 0.15 + (i % 4 === 0 ? 0.1 : 0),
                                            width: `${70 + (i % 5) * 6}%`,
                                        }}
                                    />
                                ))}
                                {/* Small cross mark */}
                                {page === 0 && (
                                    <div className="absolute bottom-3 right-3 text-[8px] opacity-30" style={{ color: "#C5A059" }}>✝</div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {/* BOOK SHADOW */}
                <div
                    className="absolute -bottom-4 left-4 right-4 h-4 rounded-full blur-md opacity-40"
                    style={{ background: "#1A237E" }}
                />
            </div>
        </div>
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
