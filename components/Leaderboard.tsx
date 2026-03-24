"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/lib/firestore";
import { getLeagueLeaderboard, LeagueParticipant, getPromotionZone, getDemotionZone } from "@/lib/leagues";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus, Crown } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { LeagueBadge } from "./LeagueBadge";
import { motion } from "framer-motion";

interface LeaderboardProps {
    className?: string;
}

function getTimeUntilLeagueReset(): string {
    const now = new Date();
    const day = now.getDay(); // 0=Dom, 1=Seg, ..., 6=Sab
    const daysUntilSunday = day === 0 ? 0 : 7 - day;

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + daysUntilSunday);
    endOfWeek.setHours(23, 59, 59, 999);

    const diff = Math.max(0, endOfWeek.getTime() - now.getTime());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return "menos de 1h";
}

export function Leaderboard({ className }: LeaderboardProps) {
    const { profile } = useAuth();
    const [participants, setParticipants] = useState<LeagueParticipant[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(getTimeUntilLeagueReset());

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (profile) {
                try {
                    const data = await getLeagueLeaderboard(profile);
                    setParticipants(data);
                } catch (err: unknown) {
                    const code = (err as { code?: string })?.code;
                    if (code === "failed-precondition") {
                        // Index still building — silently wait
                        console.warn("Leaderboard index still building, retrying in 10s...");
                        setTimeout(() => setLoading(l => l), 10000);
                    } else {
                        console.error("Leaderboard error:", err);
                    }
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchLeaderboard();
    }, [profile?.currentLeague, profile?.weeklyXp]);

    // Update time display every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeUntilLeagueReset());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!profile) return null;

    const promotionCount = getPromotionZone(profile.currentLeague as any);
    const demotionThreshold = getDemotionZone(profile.currentLeague as any);

    return (
        <div className={cn("overflow-hidden rounded-2xl border border-secondary/25 bg-white/70 backdrop-blur shadow-sm", className)}>
            <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center gap-4 border-b border-secondary/20">
                <LeagueBadge tier={profile.currentLeague as any} size="md" showLabel={false} />
                <div className="flex-1">
                    <h3 className="text-base font-black text-primary uppercase italic tracking-tight">
                        Liga {profile.currentLeague}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        Temporada Atual • Termina em {timeLeft}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-secondary uppercase italic">Top 5</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-medium">Promovem</div>
                </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground animate-pulse">
                        Carregando ranking...
                    </div>
                ) : (
                    <div className="divide-y divide-primary/8">
                        {participants.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                Você é o primeiro desta liga! 👑
                            </div>
                        )}
                        {participants.map((p: LeagueParticipant, index: number) => {
                            const rank = index + 1;
                            const isCurrentUser = p.uid === profile.uid;

                            let statusColor = "text-muted-foreground";
                            let StatusIcon = Minus;

                            if (rank <= promotionCount) {
                                statusColor = "text-accent";
                                StatusIcon = ArrowUp;
                            } else if (demotionThreshold > 0 && rank > demotionThreshold) {
                                statusColor = "text-red-400";
                                StatusIcon = ArrowDown;
                            }

                            return (
                                <motion.div
                                    key={p.uid}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "relative flex items-center gap-3 p-4 transition-all",
                                        isCurrentUser ? "bg-primary/10" : "hover:bg-primary/5",
                                        rank <= promotionCount && "bg-accent/5"
                                    )}
                                >
                                    {isCurrentUser && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                    )}
                                    <div className="w-6 text-center text-sm font-black italic text-muted-foreground">
                                        {rank === 1 ? <Crown className="w-4 h-4 text-secondary mx-auto" /> : rank}
                                    </div>
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center text-xs font-bold text-primary ring-2 ring-secondary/20">
                                            {p.photoURL ? (
                                                <img src={p.photoURL} alt={p.displayName} className="w-full h-full object-cover" />
                                            ) : (
                                                p.displayName[0]
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={cn("text-sm font-semibold", isCurrentUser ? "text-primary font-bold" : "text-foreground")}>
                                                {p.displayName}{isCurrentUser && " (Você)"}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {p.weeklyXp} XP esta semana
                                            </span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "text-xs font-bold bg-primary/10 px-2 py-1 rounded border border-primary/15",
                                        statusColor
                                    )}>
                                        <StatusIcon className="w-3 h-3" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
