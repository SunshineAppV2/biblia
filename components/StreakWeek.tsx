"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakWeekProps {
    streak: number;
    streakFreezes?: number;
}

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function StreakWeek({ streak, streakFreezes = 0 }: StreakWeekProps) {
    const [readDates, setReadDates] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("biblequest_read_dates");
        setReadDates(stored ? JSON.parse(stored) : []);
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const dateStr = d.toISOString().slice(0, 10);
        const isRead = readDates.includes(dateStr);
        const isToday = i === 6;
        return { label: DAY_LABELS[d.getDay()], isRead, isToday, dateStr };
    });

    // Helper calculate visual streak from readDates to ensure consistency with flames
    // This counts consecutive days counting back from today
    const calculateVisualStreak = () => {
        let count = 0;
        const checkDate = new Date(today);
        
        // Check if read today
        const todayStr = checkDate.toISOString().slice(0, 10);
        if (readDates.includes(todayStr)) {
            count++;
            // Go backwards
            while (true) {
                checkDate.setDate(checkDate.getDate() - 1);
                const dStr = checkDate.toISOString().slice(0, 10);
                if (readDates.includes(dStr)) {
                    count++;
                } else {
                    break;
                }
            }
        } else {
            // Check if read yesterday (streak preserved if read today later)
            checkDate.setDate(checkDate.getDate() - 1);
            const yesterdayStr = checkDate.toISOString().slice(0, 10);
            if (readDates.includes(yesterdayStr)) {
                count++;
                while (true) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    const dStr = checkDate.toISOString().slice(0, 10);
                    if (readDates.includes(dStr)) {
                        count++;
                    } else {
                        break;
                    }
                }
            }
        }
        return count;
    };

    const visualStreak = calculateVisualStreak();
    // Use the max of visual streak and database streak for safety
    const displayStreak = Math.max(streak, visualStreak);

    return (
        <div className="rounded-2xl border border-secondary/20 bg-white/70 backdrop-blur p-4">
            <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-red-400 fill-red-400" />
                <span className="text-xs font-black text-primary uppercase tracking-widest">Ofensiva Semanal</span>
                
                {streakFreezes > 0 && (
                    <div className="ml-2 flex items-center gap-1 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full text-[9px] font-bold border border-blue-200">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                        BLOQUEIO ATIVO ({streakFreezes})
                    </div>
                )}

                <span className="ml-auto text-sm font-black text-secondary">{displayStreak} {displayStreak === 1 ? 'dia' : 'dias'}</span>
            </div>
            <div className="flex justify-between gap-1">
                {days.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                                day.isRead
                                    ? "bg-red-400 border-red-400 text-white shadow-[0_0_10px_rgba(248,113,113,0.5)]"
                                    : day.isToday
                                        ? "border-secondary/50 bg-secondary/10 text-secondary"
                                        : "border-primary/10 bg-primary/5 text-muted-foreground/40"
                            }`}
                        >
                            {day.isRead ? "🔥" : day.isToday ? "✦" : "·"}
                        </motion.div>
                        <span className={`text-[9px] font-bold uppercase ${
                            day.isToday ? "text-secondary" : "text-muted-foreground/60"
                        }`}>
                            {day.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
