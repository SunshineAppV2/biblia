"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SECONDS = 10;
const PAGE_FLIP_INTERVAL = 1600;

const VERSIONS = [
    { id: "ARC",  name: "Almeida Revista e Corrigida",  abbr: "ARC"  },
    { id: "ARA",  name: "Almeida Revista e Atualizada",  abbr: "ARA"  },
    { id: "NTLH", name: "Nova Trad. Linguagem de Hoje", abbr: "NTLH" },
    { id: "NAA",  name: "Nova Almeida Atualizada",       abbr: "NAA"  },
];

function OpenBook() {
    const [flip, setFlip] = useState(0); // 0=idle 1=going 2=landing

    useEffect(() => {
        const run = () => {
            setFlip(1);
            setTimeout(() => setFlip(2), 550);
            setTimeout(() => setFlip(0), 1150);
        };
        const t = setTimeout(run, 800);
        const iv = setInterval(run, PAGE_FLIP_INTERVAL);
        return () => { clearTimeout(t); clearInterval(iv); };
    }, []);

    const N = "#1A237E";   // navy
    const D = "#0D1754";   // dark navy
    const G = "#C5A059";   // gold
    const P = "#F2EFE6";   // page cream

    return (
        <svg viewBox="0 0 360 230" width="340" height="217"
            style={{ overflow: "visible", filter: "drop-shadow(0 20px 40px rgba(26,35,126,0.35))" }}>
            <defs>
                {/* Page gradients */}
                <linearGradient id="lp" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F8F5EE" />
                    <stop offset="100%" stopColor="#E8E3D5" />
                </linearGradient>
                <linearGradient id="rp" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F8F5EE" />
                    <stop offset="100%" stopColor="#E8E3D5" />
                </linearGradient>
                {/* Spine gradient */}
                <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6B4F0A" />
                    <stop offset="40%" stopColor="#C5A059" />
                    <stop offset="60%" stopColor="#E8C97A" />
                    <stop offset="100%" stopColor="#6B4F0A" />
                </linearGradient>
                {/* Cover gradient */}
                <linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1A237E" />
                    <stop offset="100%" stopColor="#0D1754" />
                </linearGradient>
                {/* Page shadow under left page */}
                <linearGradient id="lsh" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(26,35,126,0.15)" />
                    <stop offset="100%" stopColor="rgba(26,35,126,0)" />
                </linearGradient>
                {/* Page shadow under right page */}
                <linearGradient id="rsh" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(26,35,126,0.15)" />
                    <stop offset="100%" stopColor="rgba(26,35,126,0)" />
                </linearGradient>
            </defs>

            {/* ── COVER BOTTOM (left) ── */}
            <path d="M 180,172 C 128,154 64,142 14,145 L 10,152 C 62,149 128,161 178,179 Z"
                fill={D} />
            {/* ── COVER BOTTOM (right) ── */}
            <path d="M 180,172 C 232,154 296,142 346,145 L 350,152 C 298,149 232,161 182,179 Z"
                fill={D} />

            {/* ── PAGE STACK left ── */}
            {[6,5,4,3,2,1].map((l, i) => (
                <path key={`ls${i}`}
                    d={`M 178,${164+l} C 128,${146+l} 64,${134+l} 14,${137+l} L 14,${141+l} C 66,${138+l} 128,${150+l} 180,${168+l}`}
                    fill="none" stroke={`rgba(248,245,238,${0.45+i*0.09})`} strokeWidth="1.6" strokeLinecap="round" />
            ))}
            {/* ── PAGE STACK right ── */}
            {[6,5,4,3,2,1].map((l, i) => (
                <path key={`rs${i}`}
                    d={`M 182,${164+l} C 232,${146+l} 296,${134+l} 346,${137+l} L 346,${141+l} C 294,${138+l} 232,${150+l} 180,${168+l}`}
                    fill="none" stroke={`rgba(248,245,238,${0.45+i*0.09})`} strokeWidth="1.6" strokeLinecap="round" />
            ))}

            {/* ── LEFT PAGE ── */}
            <path d="M 178,36 C 124,20 60,26 12,34 L 12,142 C 62,134 126,148 178,166 Z"
                fill="url(#lp)" stroke={N} strokeWidth="2.5" strokeLinejoin="round" />
            {/* left page inner border */}
            <path d="M 170,46 C 122,32 64,38 20,44 L 20,134 C 66,126 124,140 172,156 Z"
                fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            {/* left shadow near spine */}
            <path d="M 178,36 C 158,50 148,90 148,100 C 148,120 158,148 178,166 Z"
                fill="url(#lsh)" />
            {/* left text lines */}
            {[62,76,90,104,118,132].map((y,i)=>(
                <line key={i} x1={28+i} y1={y-i*0.4} x2={154-i*2} y2={y+i*0.4}
                    stroke={N} strokeWidth="0.9" opacity="0.11" strokeLinecap="round"/>
            ))}
            {/* Cross */}
            <text x="88" y="108" textAnchor="middle" fontSize="28" fill={G} opacity="0.22" fontWeight="bold">✝</text>

            {/* ── RIGHT PAGE (base) ── */}
            <path d="M 182,36 C 236,20 300,26 348,34 L 348,142 C 298,134 234,148 182,166 Z"
                fill="url(#rp)" stroke={N} strokeWidth="2.5" strokeLinejoin="round" />
            {/* right page inner border */}
            <path d="M 190,46 C 238,32 296,38 340,44 L 340,134 C 294,126 236,140 188,156 Z"
                fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            {/* right shadow near spine */}
            <path d="M 182,36 C 202,50 212,90 212,100 C 212,120 202,148 182,166 Z"
                fill="url(#rsh)" />
            {/* right text lines */}
            {[62,76,90,104,118,132].map((y,i)=>(
                <line key={i} x1={206+i*2} y1={y+i*0.4} x2={332-i} y2={y-i*0.4}
                    stroke={N} strokeWidth="0.9" opacity="0.11" strokeLinecap="round"/>
            ))}

            {/* ── ANIMATED FLIP PAGE ── */}
            <motion.path
                fill="#EDEAE0" stroke={N} strokeWidth="1.5"
                animate={
                    flip === 0
                        ? { d:"M 182,36 C 236,20 300,26 348,34 L 348,142 C 298,134 234,148 182,166 Z", opacity:0 }
                    : flip === 1
                        ? { d:"M 180,36 C 180,28 180,28 180,36 L 180,166 C 180,158 180,158 180,166 Z", opacity:0.9 }
                        : { d:"M 178,36 C 124,20 60,26 12,34 L 12,142 C 62,134 126,148 178,166 Z", opacity:0.5 }
                }
                transition={{ duration: 0.52, ease:"easeInOut" }}
            />

            {/* ── SPINE ── */}
            <path d="M 177,34 C 173,88 173,118 177,168 C 183,118 183,88 177,34 Z"
                fill="url(#sg)" />

            {/* ── GUTTER (bottom concave curve) ── */}
            <path d="M 12,142 C 64,132 126,148 180,168 C 234,148 296,132 348,142"
                fill="none" stroke={N} strokeWidth="3" strokeLinecap="round" />

            {/* ── COVER BOTTOM THICK EDGE ── */}
            <path d="M 10,144 C 62,134 126,150 180,170 C 234,150 298,134 350,144 L 350,154 C 298,144 234,160 180,180 C 126,160 62,144 10,154 Z"
                fill="url(#cg)" stroke={D} strokeWidth="0.5" />

            {/* ── OUTER EDGES ── */}
            <line x1="10" y1="34" x2="10" y2="154" stroke={N} strokeWidth="4" strokeLinecap="round"/>
            <line x1="350" y1="34" x2="350" y2="154" stroke={N} strokeWidth="4" strokeLinecap="round"/>

            {/* ── TOP EDGES (cover) ── */}
            <path d="M 10,34 C 64,22 124,28 178,36" fill="none" stroke={N} strokeWidth="2" strokeLinecap="round"/>
            <path d="M 182,36 C 236,28 296,22 350,34" fill="none" stroke={N} strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

const VERSION_KEY = "biblequest_version";

export function getStoredVersion(): string {
    if (typeof window === "undefined") return "ARC";
    return localStorage.getItem(VERSION_KEY) || "ARC";
}

export function SplashScreen() {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [activeVersion, setActiveVersion] = useState(0);
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [cycling, setCycling] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(VERSION_KEY);
        if (stored) {
            const idx = VERSIONS.findIndex(v => v.id === stored);
            if (idx >= 0) { setActiveVersion(idx); setSelectedVersion(stored); setCycling(false); }
        }
    }, []);

    useEffect(() => {
        const start = Date.now();
        const iv = setInterval(() => {
            const elapsed = (Date.now() - start) / (TOTAL_SECONDS * 1000);
            setProgress(Math.min(elapsed, 1));
            if (elapsed >= 1) { clearInterval(iv); setTimeout(() => setVisible(false), 400); }
        }, 50);
        return () => clearInterval(iv);
    }, []);

    // Cycle through version highlights only when not manually selected
    useEffect(() => {
        if (!cycling) return;
        const iv = setInterval(() => setActiveVersion(v => (v + 1) % VERSIONS.length), 1800);
        return () => clearInterval(iv);
    }, [cycling]);

    const handleSelectVersion = (id: string, idx: number) => {
        setSelectedVersion(id);
        setActiveVersion(idx);
        setCycling(false);
        localStorage.setItem(VERSION_KEY, id);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
                    style={{ background: "linear-gradient(160deg, #FDFBF7 0%, #E8EDF5 50%, #FDFBF7 100%)" }}
                    onClick={() => setVisible(false)}
                >
                    {/* Ambient glows */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[80px]"
                            style={{ background: "#1A237E" }} />
                        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-72 h-72 rounded-full opacity-[0.06] blur-[60px]"
                            style={{ background: "#B8820A" }} />
                    </div>

                    <div className="relative flex flex-col items-center gap-7 px-6">

                        {/* Bible */}
                        <motion.div
                            initial={{ scale: 0.75, opacity: 0, y: 24 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                        >
                            <OpenBook />
                        </motion.div>

                        {/* Title */}
                        <motion.div className="text-center space-y-1.5"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.35 }}>
                            <h1 className="text-5xl font-black tracking-tight leading-none"
                                style={{
                                    background: "linear-gradient(135deg, #C5A059 0%, #1A237E 45%, #42A5F5 100%)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                }}>
                                AnoBíblico+
                            </h1>
                            <p className="text-sm font-semibold tracking-[0.28em] uppercase"
                                style={{ color: "#455A80" }}>
                                Sua jornada bíblica
                            </p>
                        </motion.div>

                        {/* Available versions */}
                        <motion.div className="flex flex-col items-center gap-2.5 w-full max-w-xs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em]"
                                style={{ color: "#455A80" }}>
                                Versões disponíveis
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {VERSIONS.map((v, i) => {
                                    const isSelected = selectedVersion === v.id;
                                    const isActive = activeVersion === i;
                                    return (
                                        <motion.button
                                            key={v.id}
                                            onClick={(e) => { e.stopPropagation(); handleSelectVersion(v.id, i); }}
                                            animate={{
                                                backgroundColor: isSelected
                                                    ? "rgba(197,160,89,0.18)"
                                                    : isActive
                                                    ? "rgba(26,35,126,0.10)"
                                                    : "rgba(255,255,255,0.5)",
                                                borderColor: isSelected
                                                    ? "rgba(197,160,89,0.9)"
                                                    : isActive
                                                    ? "rgba(26,35,126,0.35)"
                                                    : "rgba(26,35,126,0.12)",
                                                color: isSelected ? "#8B6914" : isActive ? "#1A237E" : "#455A80",
                                                scale: isSelected ? 1.12 : isActive ? 1.06 : 1,
                                            }}
                                            transition={{ duration: 0.35 }}
                                            className="px-3 py-1.5 rounded-full border text-[11px] font-black backdrop-blur cursor-pointer"
                                            title={v.name}
                                        >
                                            {isSelected && <span className="mr-1">✓</span>}{v.abbr}
                                        </motion.button>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-center leading-relaxed"
                                style={{ color: "#6B80A8" }}>
                                {selectedVersion
                                    ? <><span style={{ color: "#8B6914", fontWeight: 700 }}>✓ Selecionada: </span>{VERSIONS[activeVersion].name}</>
                                    : VERSIONS[activeVersion].name
                                }
                            </p>
                        </motion.div>

                        {/* Progress bar */}
                        <motion.div className="w-52 space-y-2.5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}>
                            <div className="h-[3px] rounded-full overflow-hidden"
                                style={{ background: "rgba(26,35,126,0.12)" }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        background: "linear-gradient(to right, #C5A059, #1A237E, #42A5F5)",
                                        width: `${progress * 100}%`,
                                    }}
                                />
                            </div>
                            <p className="text-center text-[10px] font-semibold"
                                style={{ color: "#6B80A8" }}>
                                Toque para continuar
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
