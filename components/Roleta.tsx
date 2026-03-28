"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Scroll, Sword, PenTool, BookOpen, Mail, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { id: "lei", label: "Lei", icon: Scroll, color: "#FF5722", iconColor: "text-white" },
    { id: "historia", label: "História", icon: Sword, color: "#FFC107", iconColor: "text-black" },
    { id: "poesia", label: "Poesia", icon: PenTool, color: "#4CAF50", iconColor: "text-white" },
    { id: "evangelhos", label: "Evangelhos", icon: BookOpen, color: "#2196F3", iconColor: "text-white" },
    { id: "cartas", label: "Cartas", icon: Mail, color: "#9C27B0", iconColor: "text-white" },
    { id: "profecia", label: "Profecia", icon: Eye, color: "#E91E63", iconColor: "text-white" },
    { id: "coroa", label: "Escolha", icon: Star, color: "#FFFFFF", iconColor: "text-secondary" },
];

interface RoletaProps {
    onSpinEnd: (category: typeof CATEGORIES[0]) => void;
}

export function Roleta({ onSpinEnd }: RoletaProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const controls = useAnimation();

    const spin = async () => {
        if (isSpinning) return;
        setIsSpinning(true);

        const randomRotation = Math.floor(Math.random() * 360) + 1440; // At least 4 full turns
        await controls.start({
            rotate: randomRotation,
            transition: { duration: 4, ease: "easeOut" }
        });

        const finalRotation = randomRotation % 360;
        const segmentSize = 360 / CATEGORIES.length;
        const categoryIndex = Math.floor(((360 - finalRotation + segmentSize / 2) % 360) / segmentSize);
        
        const selected = CATEGORIES[categoryIndex];
        setTimeout(() => {
            onSpinEnd(selected);
            setIsSpinning(false);
        }, 500);
    };

    return (
        <div className="relative flex flex-col items-center justify-center gap-8">
            {/* The Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                <div className="w-8 h-8 bg-white rotate-45 border-r-4 border-b-4 border-black/10 shadow-lg flex items-center justify-center">
                   <div className="w-4 h-4 bg-secondary rounded-full" />
                </div>
            </div>

            {/* The Wheel */}
            <motion.div 
                animate={controls}
                className="w-72 h-72 rounded-full border-8 border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
                style={{ 
                    background: `conic-gradient(${CATEGORIES.map((c, i) => `${c.color} ${i * (360/CATEGORIES.length)}deg ${(i+1) * (360/CATEGORIES.length)}deg`).join(", ")})` 
                }}
            >
                {CATEGORIES.map((cat, i) => {
                    const angle = (i * (360/CATEGORIES.length)) + (360/CATEGORIES.length / 2);
                    const Icon = cat.icon;
                    return (
                        <div 
                            key={cat.id}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-85px)` }}
                        >
                            <div className={cn("w-10 h-10 flex items-center justify-center", cat.iconColor)} style={{ transform: `rotate(${-angle}deg)` }}>
                                <Icon className="w-6 h-6" />
                            </div>
                        </div>
                    );
                })}
                
                {/* Center Hub */}
                <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full border-4 border-[#0E1B5C] shadow-inner flex items-center justify-center z-10">
                     <div className="w-4 h-4 bg-secondary rounded-full animate-pulse" />
                </div>
            </motion.div>

            <button 
                onClick={spin}
                disabled={isSpinning}
                className={cn(
                    "px-10 py-5 rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl transition-all active:scale-95",
                    isSpinning ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-secondary text-white hover:bg-secondary/90 shadow-secondary/20"
                )}
            >
                {isSpinning ? "Girando..." : "GIRAR ROLETA!"}
            </button>
        </div>
    );
}
