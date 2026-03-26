"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ACHIEVEMENTS, Achievement } from "@/lib/achievements";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { cn, calculateStreak } from "@/lib/utils";
import { motion } from "framer-motion";
import { MobileNav } from "@/components/MobileNav";

const CATEGORY_LABELS: Record<string, string> = {
    leitura: "📖 Leitura",
    streak: "🔥 Ofensiva",
    nivel: "⭐ Nível",
    liga: "🏆 Liga",
    sabedoria: "🕊️ Sabedoria",
};

export default function ConquistasPage() {
    const { user, profile } = useAuth();
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const fetch = async () => {
            try {
                const snap = await getDoc(doc(db, "users", user.uid));
                setUnlockedIds(snap.data()?.achievements ?? []);
            } catch {
                setUnlockedIds([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [user]);

    const totalUnlocked = unlockedIds.length;
    const totalAchievements = ACHIEVEMENTS.length;

    const byCategory = ACHIEVEMENTS.reduce<Record<string, Achievement[]>>((acc, a) => {
        if (!acc[a.category]) acc[a.category] = [];
        acc[a.category].push(a);
        return acc;
    }, {});

    function getProgress(achievement: Achievement): { value: number; max: number } | null {
        if (!profile) return null;
        switch (achievement.id) {
            case "chapters_10": return { value: Math.min(profile.totalChapters ?? 0, 10), max: 10 };
            case "chapters_50": return { value: Math.min(profile.totalChapters ?? 0, 50), max: 50 };
            case "chapters_100": return { value: Math.min(profile.totalChapters ?? 0, 100), max: 100 };
            case "chapters_500": return { value: Math.min(profile.totalChapters ?? 0, 500), max: 500 };
            case "bible_complete": return { value: Math.min(profile.totalChapters ?? 0, 1189), max: 1189 };
            case "streak_3": return { value: Math.min(calculateStreak(profile.readDates || []), 3), max: 3 };
            case "streak_7": return { value: Math.min(calculateStreak(profile.readDates || []), 7), max: 7 };
            case "streak_30": return { value: Math.min(calculateStreak(profile.readDates || []), 30), max: 30 };
            case "streak_100": return { value: Math.min(calculateStreak(profile.readDates || []), 100), max: 100 };
            case "streak_365": return { value: Math.min(calculateStreak(profile.readDates || []), 365), max: 365 };
            case "wisdom_10": return { value: Math.min(profile.wisdomPoints ?? 0, 10), max: 10 };
            case "wisdom_100": return { value: Math.min(profile.wisdomPoints ?? 0, 100), max: 100 };
            default: return null;
        }
    }

    return (
        <div className="min-h-screen bg-background pb-10">
            {/* Header */}
            <header className="sticky top-0 bg-white/70 backdrop-blur border-b border-secondary/20 z-10 px-4 py-3 flex items-center gap-3">
                <Link href="/profile" className="p-1 hover:bg-primary/10 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5 text-primary" />
                </Link>
                <div>
                    <h1 className="text-lg font-black text-primary leading-none">Conquistas</h1>
                    <p className="text-xs text-muted-foreground">{totalUnlocked} de {totalAchievements} desbloqueadas</p>
                </div>
                <div className="ml-auto">
                    <div className="text-right">
                        <p className="text-xl font-black text-secondary">{Math.round((totalUnlocked / totalAchievements) * 100)}%</p>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 pt-5 space-y-6">
                {/* Overall progress bar */}
                <div className="bg-white/70 rounded-2xl border border-secondary/20 p-4">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2">
                        <span>Progresso geral</span>
                        <span>{totalUnlocked}/{totalAchievements}</span>
                    </div>
                    <div className="h-2.5 bg-primary/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-secondary to-accent rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(totalUnlocked / totalAchievements) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {!user && (
                    <p className="text-center text-sm text-muted-foreground bg-white/70 rounded-2xl p-4 border border-secondary/20">
                        Faça login para ver suas conquistas desbloqueadas.
                    </p>
                )}

                {/* Categories */}
                {Object.entries(byCategory).map(([category, achievements]) => {
                    const catUnlocked = achievements.filter(a => unlockedIds.includes(a.id)).length;
                    return (
                        <div key={category}>
                            <div className="flex items-center justify-between mb-2 px-1">
                                <h2 className="text-sm font-black text-primary uppercase tracking-wider">
                                    {CATEGORY_LABELS[category] ?? category}
                                </h2>
                                <span className="text-xs text-muted-foreground font-bold">{catUnlocked}/{achievements.length}</span>
                            </div>
                            <div className="space-y-2">
                                {achievements.map((achievement, idx) => {
                                    const unlocked = unlockedIds.includes(achievement.id);
                                    const progress = getProgress(achievement);

                                    return (
                                        <motion.div
                                            key={achievement.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                            className={cn(
                                                "rounded-xl border p-4 flex items-center gap-4 transition-all",
                                                unlocked
                                                    ? "bg-white/80 border-secondary/30 shadow-sm"
                                                    : "bg-white/40 border-primary/10"
                                            )}
                                        >
                                            {/* Icon */}
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border",
                                                unlocked
                                                    ? "bg-secondary/15 border-secondary/30"
                                                    : "bg-primary/5 border-primary/10 grayscale opacity-50"
                                            )}>
                                                {unlocked ? achievement.icon : <Lock className="w-5 h-5 text-muted-foreground" />}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className={cn(
                                                        "font-bold text-sm",
                                                        unlocked ? "text-primary" : "text-muted-foreground"
                                                    )}>
                                                        {achievement.title}
                                                    </p>
                                                    {unlocked && (
                                                        <span className="text-[10px] font-black text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-full border border-secondary/20">
                                                            +{achievement.xpBonus} XP
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={cn(
                                                    "text-xs mt-0.5",
                                                    unlocked ? "text-muted-foreground" : "text-muted-foreground/60"
                                                )}>
                                                    {achievement.description}
                                                </p>

                                                {/* Progress bar for locked achievements */}
                                                {!unlocked && progress && progress.value > 0 && (
                                                    <div className="mt-2">
                                                        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                                            <span>Progresso</span>
                                                            <span>{progress.value}/{progress.max}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-accent rounded-full transition-all"
                                                                style={{ width: `${(progress.value / progress.max) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Unlocked badge */}
                                            {unlocked && (
                                                <div className="text-2xl shrink-0">{achievement.icon}</div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                    </div>
                )}
            </div>

            <div className="h-24" />
            <MobileNav />
        </div>
    );
}
