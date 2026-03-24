"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakWeekProps {
    streak: number;
}

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function StreakWeek({ streak }: StreakWeekProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const dateStr = d.toISOString().slice(0, 10);
        const stored = localStorage.getItem("biblequest_read_dates");
        const readDates: string[] = stored ? JSON.parse(stored) : [];
        const isRead = readDates.includes(dateStr);
        const isToday = i === 6;
        return { label: DAY_LABELS[d.getDay()], isRead, isToday, dateStr };
    });

    return (
        <div className="rounded-2xl border border-secondary/20 bg-white/70 backdrop-blur p-4">
            <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-red-400 fill-red-400" />
                <span className="text-xs font-black text-primary uppercase tracking-widest">Ofensiva Semanal</span>
                <span className="ml-auto text-sm font-black text-secondary">{streak} dias</span>
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
