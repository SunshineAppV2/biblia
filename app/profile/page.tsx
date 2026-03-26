"use client";

import { useAuth } from "@/components/AuthProvider";
import { getLevelInfo } from "@/lib/levels";
import { LEAGUE_CONFIGS } from "@/lib/leagues";
import { LeagueBadge } from "@/components/LeagueBadge";
import { ChevronLeft, Calendar, Award, BookOpen, Flame, Zap, Trophy, Bookmark, Bell, BellOff, Shield, Gem } from "lucide-react";
import { LeagueTier } from "@/lib/leagues";
import { motion } from "framer-motion";
import Link from "next/link";
import { LevelProgressBar } from "@/components/LevelProgressBar";
import { ACHIEVEMENTS, Achievement } from "@/lib/achievements";
import { useEffect, useState } from "react";
import { cn, getLocalDateString, calculateStreak } from "@/lib/utils";
import { requestNotificationPermission, disableNotifications, isNotificationsEnabled } from "@/lib/notifications";
import { ReadingHeatmap } from "@/components/ReadingHeatmap";
import { ShareButton } from "@/components/ShareButton";
import { buyStreakFreeze } from "@/lib/firestore";
import { useToast } from "@/components/Toast";

export default function ProfilePage() {
    const { user, profile, logout, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [notifyEnabled, setNotifyEnabled] = useState(false);
    const [buying, setBuying] = useState(false);
    useEffect(() => { setNotifyEnabled(isNotificationsEnabled()); }, []);

    const handleBuyFreeze = async () => {
        if (!user || (profile?.gems ?? 0) < 50 || buying) return;
        setBuying(true);
        try {
            await buyStreakFreeze(user.uid, 50);
            await refreshProfile();
            showToast("🛡️ Bloqueio de ofensiva adquirido!", "achievement");
        } catch (error) {
            console.error("Failed to buy freeze", error);
            showToast("Erro ao processar compra.", "error");
        } finally {
            setBuying(false);
        }
    };


    const toggleNotifications = async () => {
        if (notifyEnabled) {
            disableNotifications();
            setNotifyEnabled(false);
        } else {
            const granted = await requestNotificationPermission();
            setNotifyEnabled(granted);
        }
    };

    useEffect(() => {
        if (profile?.achievements) {
            setUnlockedIds(profile.achievements);
        }
    }, [profile?.achievements]);

    if (!user || !profile) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-white">Ops! Você precisa estar logado.</h1>
                    <Link href="/" className="inline-block text-primary hover:underline">
                        Voltar para o Início
                    </Link>
                </div>
            </div>
        );
    }

    const levelInfo = getLevelInfo(profile.xp);
    const leagueConfig = LEAGUE_CONFIGS[profile.currentLeague as LeagueTier];
    const unlockedCount = unlockedIds.length;
    const totalAchievements = ACHIEVEMENTS.length;

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="p-4 flex items-center justify-between glass border-b border-white/5 sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-primary" />
                </Link>
                <h1 className="text-lg font-black text-primary uppercase italic tracking-widest">Seu Perfil</h1>
                <button
                    onClick={logout}
                    className="text-xs font-bold text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                    Sair
                </button>
            </header>

            <main className="max-w-xl mx-auto p-6 space-y-8">
                {/* User Card */}
                <section className="flex flex-col items-center gap-6 text-center pt-8">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-primary/30 overflow-hidden ring-4 ring-secondary/20 shadow-2xl">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                                    {user.displayName?.[0]}
                                </div>
                            )}
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-2 -right-2 bg-secondary text-secondary-foreground font-black p-2 rounded-xl shadow-lg border-2 border-background text-xs"
                        >
                            NV. {levelInfo.currentLevel}
                        </motion.div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-primary italic truncate max-w-[300px]">
                            {user.displayName}
                        </h2>
                        <p className="text-muted-foreground text-sm flex items-center justify-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            Membro desde{" "}
                            {new Date(user.metadata.creationTime || Date.now()).toLocaleDateString("pt-BR", {
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </section>

                {/* Level Stats */}
                <section className="glass-card p-6 space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Progresso de Nível
                        </span>
                        <span className="text-sm font-black text-primary">XP TOTAL: {profile.xp}</span>
                    </div>
                    <LevelProgressBar
                        level={levelInfo.currentLevel}
                        progressPercentage={levelInfo.progressPercentage}
                        xpInCurrentLevel={levelInfo.xpInCurrentLevel}
                        xpRequiredForNextLevel={levelInfo.xpRequiredForNextLevel}
                        title={levelInfo.title}
                    />
                    <div className="flex items-center gap-2 pt-2 border-t border-primary/5">
                        <Gem className="w-4 h-4 text-blue-500 fill-current" />
                        <span className="text-sm font-black text-primary">{profile.gems || 0} Gemas</span>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 space-y-2 border-l-4 border-secondary/50">
                        <div className="text-secondary flex items-center gap-2">
                            <Flame className="w-4 h-4 fill-current" />
                            <span className="text-xs uppercase font-black">Ofensiva</span>
                        </div>
                        <div className="text-2xl font-black text-primary">{calculateStreak(profile.readDates || [])} dias</div>
                        <ShareButton type="streak" value={profile.streak} />
                    </div>
                    <div className="glass-card p-4 space-y-2 border-l-4 border-accent/50">
                        <div className="text-accent flex items-center gap-2">
                            <Trophy className="w-4 h-4 fill-current" />
                            <span className="text-xs uppercase font-black">XP Semanal</span>
                        </div>
                        <div className="text-2xl font-black text-primary">{profile.weeklyXp} XP</div>
                    </div>
                    <div className="glass-card p-4 space-y-2 border-l-4 border-primary/50">
                        <div className="text-primary flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-xs uppercase font-black">Capítulos</span>
                        </div>
                        <div className="text-2xl font-black text-primary">{profile.totalChapters || 0}</div>
                    </div>
                    <div className="glass-card p-4 space-y-2 border-l-4 border-secondary/50">
                        <div className="text-secondary flex items-center gap-2">
                            <Zap className="w-4 h-4 fill-current" />
                            <span className="text-xs uppercase font-black">Conquistas</span>
                        </div>
                        <div className="text-2xl font-black text-primary">
                            {unlockedCount}/{totalAchievements}
                        </div>
                    </div>
                </section>

                {/* Quick links */}
                <section className="grid grid-cols-2 gap-3">
                    <Link
                        href="/favoritos"
                        className="glass-card p-4 flex items-center gap-3 hover:border-secondary/40 transition-colors"
                    >
                        <div className="w-9 h-9 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center shrink-0">
                            <Bookmark className="w-4 h-4 text-secondary fill-secondary" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-primary uppercase tracking-wider leading-none">Favoritos</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Versículos salvos</p>
                        </div>
                    </Link>
                    <Link
                        href="/conquistas"
                        className="glass-card p-4 flex items-center gap-3 hover:border-secondary/40 transition-colors"
                    >
                        <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                            <Award className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-primary uppercase tracking-wider leading-none">Conquistas</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{unlockedCount}/{totalAchievements} desbloqueadas</p>
                        </div>
                    </Link>
                </section>

                {/* Reading Heatmap */}
                <ReadingHeatmap userId={user.uid} />

                {/* Streak Freezes — Feature request: Bloqueio de ofensiva */}
                <section className="glass-card p-4 flex items-center justify-between border-blue-400/30 bg-blue-500/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                             <Shield className="w-5 h-5 text-blue-500 shadow-sm" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-primary uppercase tracking-wider">Bloqueio de Ofensiva</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                                 {profile.streakFreezes && profile.streakFreezes > 0 
                                     ? `Você possui ${profile.streakFreezes} bloqueio(s) ativo(s).`
                                     : "Proteja sua ofensiva se você esquecer de ler um dia."}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleBuyFreeze}
                        disabled={buying || (profile.gems || 0) < 50}
                        className={cn(
                             "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border shadow-lg relative z-10",
                             (profile.gems || 0) >= 50 
                                 ? "bg-blue-500 border-blue-600 text-white hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-95" 
                                 : "bg-muted border-muted text-muted-foreground cursor-not-allowed opacity-60"
                        )}
                    >
                        {buying ? "..." : (profile.gems || 0) >= 50 ? "Comprar (50 Gemas)" : "Gemas Insuficientes"}
                    </button>
                </section>

                {/* Notifications */}
                <section className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border", notifyEnabled ? "bg-accent/15 border-accent/25" : "bg-muted/50 border-muted")}>
                            {notifyEnabled ? <Bell className="w-4 h-4 text-accent" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <div>
                            <p className="text-xs font-black text-primary uppercase tracking-wider">Lembretes Diários</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{notifyEnabled ? "Ativo — você receberá lembretes" : "Desativado"}</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleNotifications}
                        className={cn("px-3 py-1.5 rounded-full text-xs font-bold transition-all border", notifyEnabled ? "bg-red-400/10 border-red-400/25 text-red-400 hover:bg-red-400/20" : "bg-accent/10 border-accent/25 text-accent hover:bg-accent/20")}
                    >
                        {notifyEnabled ? "Desativar" : "Ativar"}
                    </button>
                </section>

                {/* Share Level */}
                <section className="glass-card p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Compartilhar</p>
                        <p className="text-sm font-bold text-primary">Nível {levelInfo.currentLevel} — {levelInfo.title}</p>
                    </div>
                    <ShareButton type="level" value={levelInfo.currentLevel} />
                </section>

                {/* Wisdom Points — only shown when user reached level 66 */}
                {(profile.wisdomPoints || 0) > 0 && (
                    <section className="glass-card p-6 space-y-4 border border-secondary/30 bg-gradient-to-br from-secondary/10 to-secondary/5">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🕊️</span>
                            <div>
                                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Leitura Contemplativa</span>
                                <h3 className="text-xl font-black text-primary">
                                    {profile.wisdomPoints} Pontos de Sabedoria
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Conquistados após atingir o nível máximo
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {[
                                { label: "Contemplativo", threshold: 10, icon: "🕊️" },
                                { label: "Mestre Contemplativo", threshold: 100, icon: "✨" },
                                { label: "Segunda Aliança", threshold: 1189, icon: "📜" },
                            ].map(({ label, threshold, icon }) => {
                                const wp = profile.wisdomPoints || 0;
                                const progress = Math.min(100, (wp / threshold) * 100);
                                const done = wp >= threshold;
                                return (
                                    <div key={label} className="flex items-center gap-3">
                                        <span className={done ? "" : "grayscale opacity-40"}>{icon}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-[10px] mb-0.5">
                                                <span className={done ? "text-secondary font-bold" : "text-muted-foreground"}>{label}</span>
                                                <span className="text-muted-foreground">{Math.min(wp, threshold)}/{threshold}</span>
                                            </div>
                                            <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full transition-all", done ? "bg-secondary" : "bg-secondary/30")}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* League Status */}
                <section className="glass-card p-6 flex items-center gap-6 bg-gradient-to-br from-primary/10 to-primary/5 border-secondary/30">
                    <LeagueBadge tier={profile.currentLeague as LeagueTier} size="lg" />
                    <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Liga Atual</span>
                        <h3 className="text-2xl font-black text-primary uppercase italic tracking-tight">
                            Liga {profile.currentLeague}
                        </h3>
                        <p className="text-xs text-muted-foreground">{leagueConfig.description}</p>
                    </div>
                </section>

                {/* Achievements */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary" /> Conquistas ({unlockedCount}/{totalAchievements})
                        </h3>
                        <Link href="/conquistas" className="text-xs text-accent font-bold hover:underline">
                            Ver todas →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {ACHIEVEMENTS.map((achievement: Achievement, i: number) => {
                            const isUnlocked = unlockedIds.includes(achievement.id);
                            return (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className={cn(
                                        "glass-card flex items-center gap-4 p-4 transition-all",
                                        !isUnlocked && "grayscale opacity-40"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-all",
                                        isUnlocked
                                            ? "bg-primary/20 border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                            : "bg-primary/20 border-secondary/10"
                                    )}>
                                        {achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-primary">{achievement.title}</div>
                                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                                        <div className="text-[10px] text-accent font-bold mt-1">+{achievement.xpBonus} XP</div>
                                    </div>
                                    {isUnlocked && (
                                        <div className="text-accent text-xs font-black uppercase tracking-wider">
                                            ✓
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}
